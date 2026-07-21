import User from "../models/user.model.js";

const getExploreUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const currentUser = await User.findById(userId);

        const users = await User.find({
            _id: { $ne: userId },
        })
            .select("-password")
            .skip((page - 1) * limit)
            .limit(limit);

        const exploreUsers = users.map((user) => {
            let relationship = "NONE";

            if (
                currentUser.friends.some(
                    id => id.toString() === user._id.toString()
                )
            ) {
                relationship = "FRIENDS";
            }
            else if (
                currentUser.sentRequests.some(
                    id => id.toString() === user._id.toString()
                )
            ) {
                relationship = "REQUEST_SENT";
            }
            else if (
                currentUser.friendRequests.some(
                    id => id.toString() === user._id.toString()
                )
            ) {
                relationship = "REQUEST_RECEIVED";
            }

            return {
                ...user.toObject(),
                relationship,
            };
        });

        return res.status(200).json(exploreUsers);

    } catch (error) {
        console.log("Error in getExploreUsers controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(200).json([]);
        }

        const users = await User.find({
            _id: { $ne: userId },
            fullName: {
                $regex: query.trim(),
                $options: "i",
            },
        })
            .select("-password")
            .limit(20);

        return res.status(200).json(users);

    } catch (error) {
        console.log("Error in searchUsers controller:", error.message);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const userController = {
    getExploreUsers,
    searchUsers,
};