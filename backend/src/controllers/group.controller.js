import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        const creatorId = req.user._id;

        if (!groupName || !groupName.trim()) {
            return res.status(400).json({
                message: "Group name is required.",
            });
        }

        const group = await Group.create({
            groupName: groupName.trim(),
            admins: [creatorId],
            members: [creatorId],
        });

        await User.findByIdAndUpdate(
            creatorId,
            {
                $addToSet: {
                    groups: group._id,
                },
            }
        );

        const populatedGroup = await Group.findById(group._id)
            .populate("admins", "-password")
            .populate("members", "-password");

        // Notify creator
        const creatorSocketId = getReceiverSocketId(creatorId);

        if (creatorSocketId) {
            io.to(creatorSocketId).emit("groupCreated");
        }

        // Returning admins[],members[]
        return res.status(201).json({
            message: "Group created successfully.",
            group: populatedGroup,
        });

    } catch (error) {
        console.log("Error in createGroup controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getGroups = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .populate({
                path: "groups",
                select: "groupName groupPic"
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        return res.status(200).json(user.groups);

    } catch (error) {
        console.log("Error in getGroups controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId)
            .populate("admins", "-password")
            .populate("members", "-password");

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        const isMember = group.members.some(
            member => member._id.toString() === userId.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this group.",
            });
        }

        return res.status(200).json(group);

    } catch (error) {
        console.log("Error in getGroup controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const adminId = req.user._id;

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                message: "Please provide memberIds.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can add members
        // if (!group.admins.some(id => id.toString() === adminId.toString())) {
        //     return res.status(403).json({
        //         message: "Only admins can add members.",
        //     });
        // }

        // Add members to the group
        group.members.push(...memberIds);
        await group.save();

        // Add group to each user's groups array
        await User.updateMany(
            { _id: { $in: memberIds } },
            {
                $push: {
                    groups: group._id,
                },
            }
        );

        // Notify every newly added member
        for (const memberId of memberIds) {
            const memberSocketId = getReceiverSocketId(memberId);

            if (memberSocketId) {
                io.to(memberSocketId).emit("groupAdded");
            }
        }
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupMembersUpdated");
            }
        }

        const updatedGroup = await Group.findById(groupId)
            .populate("admins", "-password")
            .populate("members", "-password");

        return res.status(200).json({
            message: "Members added successfully.",
            group: updatedGroup,
        });

    } catch (error) {
        console.log("Error in addMember controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const adminId = req.user._id;

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                message: "Please provide memberIds.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can remove members
        if (!group.admins.some(id => id.toString() === adminId.toString())) {
            return res.status(403).json({
                message: "Only admins can remove members.",
            });
        }

        // Remove members from the group
        group.members = group.members.filter(
            member => !memberIds.includes(member.toString())
        );

        await group.save();

        // Remove the group from each user's groups array
        await User.updateMany(
            { _id: { $in: memberIds } },
            {
                $pull: {
                    groups: group._id,
                },
            }
        );

        // Notify removed members
        for (const memberId of memberIds) {
            const socketId = getReceiverSocketId(memberId);

            if (socketId) {
                io.to(socketId).emit("groupRemoved");
            }
        }

        // Notify remaining members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupMembersUpdated");
            }
        }

        const updatedGroup = await Group.findById(groupId)
            .populate("admins", "-password")
            .populate("members", "-password");

        return res.status(200).json({
            message: "Members removed successfully.",
            group: updatedGroup,
        });

    } catch (error) {
        console.log("Error in removeMember controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Check if user is an admin
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        // If user is the only admin, don't allow leaving
        if (isAdmin && group.admins.length === 1) {
            return res.status(400).json({
                message: "Make at least one more admin before leaving the group.",
            });
        }

        // Remove user from members
        group.members = group.members.filter(
            id => id.toString() !== userId.toString()
        );

        // Remove user from admins (if admin)
        group.admins = group.admins.filter(
            id => id.toString() !== userId.toString()
        );

        await group.save();

        // Remove group from user's groups array
        await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    groups: group._id,
                },
            }
        );

        // Notify the user who left
        const userSocketId = getReceiverSocketId(userId);

        if (userSocketId) {
            io.to(userSocketId).emit("groupLeft");
        }

        // Notify remaining members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupMembersUpdated");
            }
        }

        return res.status(200).json({
            message: "You have left the group successfully.",
        });

    } catch (error) {
        console.log("Error in leaveGroup controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const renameGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupName } = req.body;
        const userId = req.user._id;

        if (!groupName || !groupName.trim()) {
            return res.status(400).json({
                message: "Group name is required.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can rename the group
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can rename the group.",
            });
        }

        group.groupName = groupName.trim();
        await group.save();

        // Notify all group members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupRenamed");
            }
        }

        return res.status(200).json({
            message: "Group renamed successfully.",
            group,
        });

    } catch (error) {
        console.log("Error in renameGroup controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const updateGroupPicture = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { groupPic } = req.body;
        const userId = req.user._id;

        if (!groupPic) {
            return res.status(400).json({
                message: "Group picture is required.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can update the group picture
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can update the group picture.",
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(groupPic);

        group.groupPic = uploadResponse.secure_url;
        await group.save();

        // Notify all group members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupPictureUpdated");
            }
        }

        return res.status(200).json({
            message: "Group picture updated successfully.",
            group,
        });

    } catch (error) {
        console.log("Error in updateGroupPicture controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can delete the group
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can delete the group.",
            });
        }

        // Remove this group from all members' groups array
        await User.updateMany(
            { _id: { $in: group.members } },
            {
                $pull: {
                    groups: group._id,
                },
            }
        );

        // Notify all members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupDeleted");
            }
        }

        // Delete the group
        await Group.findByIdAndDelete(groupId);

        return res.status(200).json({
            message: "Group deleted successfully.",
        });

    } catch (error) {
        console.log("Error in deleteGroup controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                message: "Please provide memberIds.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can make other members admins
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can make other members admins.",
            });
        }

        // Add selected members as admins
        group.admins.push(...memberIds);

        await group.save();

        // Notify all group members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupAdminsUpdated");
            }
        }

        const updatedGroup = await Group.findById(groupId)
            .populate("admins", "-password")
            .populate("members", "-password");

        return res.status(200).json({
            message: "Admins updated successfully.",
            group: updatedGroup,
        });

    } catch (error) {
        console.log("Error in makeAdmin controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const removeAdmin = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { memberIds } = req.body;
        const userId = req.user._id;

        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({
                message: "Please provide memberIds.",
            });
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can remove admins
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can remove admins.",
            });
        }

        // Don't allow removing all admins
        if (group.admins.length - memberIds.length < 1) {
            return res.status(400).json({
                message: "A group must have at least one admin.",
            });
        }

        group.admins = group.admins.filter(
            admin => !memberIds.includes(admin.toString())
        );

        await group.save();

        // Notify all group members
        for (const memberId of group.members) {
            const socketId = getReceiverSocketId(memberId.toString());

            if (socketId) {
                io.to(socketId).emit("groupAdminsUpdated");
            }
        }

        const updatedGroup = await Group.findById(groupId)
            .populate("admins", "-password")
            .populate("members", "-password");

        return res.status(200).json({
            message: "Admins updated successfully.",
            group: updatedGroup,
        });

    } catch (error) {
        console.log("Error in removeAdmin controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const getAvailableMembers = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                message: "Group not found.",
            });
        }

        // Only admins can access this
        const isAdmin = group.admins.some(
            id => id.toString() === userId.toString()
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only admins can add members.",
            });
        }

        const user = await User.findById(userId).populate(
            "friends",
            "-password"
        );

        const availableMembers = user.friends.filter(friend =>
            !group.members.some(
                member => member.toString() === friend._id.toString()
            )
        );

        return res.status(200).json({
            availableMembers,
        });

    } catch (error) {
        console.log("Error in getAvailableMembers controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const groupController = {
    createGroup,
    getGroups,
    getGroup,
    addMember,
    removeMember,
    leaveGroup,
    renameGroup,
    updateGroupPicture,
    deleteGroup,
    makeAdmin,
    removeAdmin,
    getAvailableMembers,
};