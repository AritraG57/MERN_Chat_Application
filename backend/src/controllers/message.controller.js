import User from "../models/user.model.js";

const getUserForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : {$ne : loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch(error) {
        console.error("Error in getUsersForSidebar",error.message);
        res.status(500).json({message : "Internal Server Error"});
    }
};

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
}

export const messageController = {
    getUserForSidebar,
    getMessages,
};