import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Group from "../models/group.model.js";


const getMessages = async (req,res) => {
    try {
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId : myId,receiverId : userToChatId},
                {senderId : userToChatId,receiverId : myId}
            ]
        })

        res.status(200).json(messages);
    } catch(error) {
        console.log("Error in getMessages controller",error.message);
        res.status(500).json({message : "Internal Server error"});
    }
};

const sendMessage = async (req,res) => {
    try {
        const {text,image} = req.body;
        const{id : receiverId} = req.params;
        const senderId = req.user._id;

        if(!text && !image){
            return res.status(400).json({
                message:"Message cannot be empty"
            });
        }

        let imageUrl;
        if(image) {
            //Upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message ({
            senderId,
            receiverId,
            text,
            image : imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller ",error.message);
        res.status(500).json({ message : "Internal Server Error"});
    }
};

const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // User must be a member
        const isMember = group.members.some(
            id => id.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this group.",
            });
        }

        const messages = await Message.find({
            groupId,
        }).populate("senderId", "-password");

        return res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getGroupMessages controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Check if sender is a member of the group
        const isMember = group.members.some(
            id => id.toString() === senderId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this group.",
            });
        }

        let imageUrl = "";

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            groupId,
            text,
            image: imageUrl,
        });

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("senderId", "-password");

        // Notify all online group members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("newGroupMessage", populatedMessage);
            }
        }

        return res.status(201).json(populatedMessage);

    } catch (error) {
        console.log("Error in sendGroupMessage controller:", error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const messageController = {
    getMessages,
    sendMessage,
    getGroupMessages,
    sendGroupMessage,
};