import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.userId;

        // Cannot send request to yourself
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                message: "You cannot send a friend request to yourself.",
            });
        }

        // Find both users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Already friends
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({
                message: "You are already friends.",
            });
        }

        // Request already sent
        if (sender.sentRequests.includes(receiverId)) {
            return res.status(400).json({
                message: "Friend request already sent.",
            });
        }

        // Receiver has already sent a request to sender
        if (sender.friendRequests.includes(receiverId)) {
            return res.status(400).json({
                message: "This user has already sent you a friend request.",
            });
        }

        // Add request
        await User.findByIdAndUpdate(senderId, {
            $addToSet: {
                sentRequests: receiverId,
            },
        });

        await User.findByIdAndUpdate(receiverId, {
            $addToSet: {
                friendRequests: senderId,
            },
        });

        // Notify receiver
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friendRequestReceived");
        }

        // Notify sender
        const senderSocketId = getReceiverSocketId(senderId);

        if (senderSocketId) {
            io.to(senderSocketId).emit("sentRequestUpdated");
        }

        return res.status(200).json({
            message: "Friend request sent successfully.",
        });
    } catch (error) {
        console.log("Error in sendFriendRequest controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user._id;
        const senderId = req.params.userId;

        // Find both users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Check if a friend request actually exists
        const requestExists = receiver.friendRequests.some(
            (id) => id.toString() === senderId
        );

        if (!requestExists) {
            return res.status(400).json({
                message: "No friend request found.",
            });
        }

        // Remove pending request
        await User.findByIdAndUpdate(senderId, {
            $pull: {
                sentRequests: receiverId,
            },
        });

        await User.findByIdAndUpdate(receiverId, {
            $pull: {
                friendRequests: senderId,
            },
        });

        // If they were previously removed friends, remove from removedFriends
        if (
            sender.removedFriends.some(
                (id) => id.toString() === receiverId.toString()
            ) &&
            receiver.removedFriends.some(
                (id) => id.toString() === senderId.toString()
            )
        ) {
            await User.findByIdAndUpdate(senderId, {
                $pull: {
                    removedFriends: receiverId,
                },
            });

            await User.findByIdAndUpdate(receiverId, {
                $pull: {
                    removedFriends: senderId,
                },
            });
        }

        // Add both users as friends
        await User.findByIdAndUpdate(senderId, {
            $addToSet: {
                friends: receiverId,
            },
        });

        await User.findByIdAndUpdate(receiverId, {
            $addToSet: {
                friends: senderId,
            },
        });

        // Notify sender
        const senderSocketId = getReceiverSocketId(senderId);

        if (senderSocketId) {
            io.to(senderSocketId).emit("friendRequestAccepted");
        }

        // Notify receiver
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friendRequestAccepted");
        }
        

        return res.status(200).json({
            message: "Friend request accepted successfully.",
        });

    } catch (error) {
        console.log("Error in acceptFriendRequest controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user._id;
        const senderId = req.params.userId;

        // Find both users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Check if the friend request exists
        const requestExists = receiver.friendRequests.some(
            (id) => id.toString() === senderId
        );

        if (!requestExists) {
            return res.status(400).json({
                message: "No friend request found.",
            });
        }

        // Remove the pending request
        await User.findByIdAndUpdate(senderId, {
            $pull: {
                sentRequests: receiverId,
            },
        });

        await User.findByIdAndUpdate(receiverId, {
            $pull: {
                friendRequests: senderId,
            },
        });

        // Notify sender
        const senderSocketId = getReceiverSocketId(senderId);

        if (senderSocketId) {
            io.to(senderSocketId).emit("friendRequestRejected");
        }

        // Notify receiver
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("friendRequestRejected");
        }

        return res.status(200).json({
            message: "Friend request rejected successfully.",
        });

    } catch (error) {
        console.log("Error in rejectFriendRequest controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const removeFriend = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.userId;

        // Find both users
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        // Check if they are actually friends
        const areFriends = user.friends.some(
            (id) => id.toString() === friendId
        );

        if (!areFriends) {
            return res.status(400).json({
                message: "You are not friends.",
            });
        }

        // Remove each other from friends list and add to removedFriends
        await User.findByIdAndUpdate(userId, {
            $pull: {
                friends: friendId,
            },
            $addToSet: {
                removedFriends: friendId,
            },
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: {
                friends: userId,
            },
            $addToSet: {
                removedFriends: userId,
            },
        });

        // Notify current user
        const userSocketId = getReceiverSocketId(userId);

        if (userSocketId) {
            io.to(userSocketId).emit("friendRemoved");
        }

        // Notify removed friend
        const friendSocketId = getReceiverSocketId(friendId);

        if (friendSocketId) {
            io.to(friendSocketId).emit("friendRemoved");
        }
        

        return res.status(200).json({
            message: "Friend removed successfully.",
        });

    } catch (error) {
        console.log("Error in removeFriend controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getFriends = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("friends", "-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json(user.friends);

    } catch (error) {
        console.log("Error in getFriends controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("friendRequests", "-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json(user.friendRequests);

    } catch (error) {
        console.log("Error in getFriendRequests controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getSentRequests = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate("sentRequests", "-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json(user.sentRequests);

    } catch (error) {
        console.log("Error in getSentRequests controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const friendController = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getFriendRequests,
    getSentRequests,
}