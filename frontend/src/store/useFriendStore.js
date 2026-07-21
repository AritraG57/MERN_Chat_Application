import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useFriendStore = create((set, get) => ({
    friends: [],
    friendRequests: [],
    sentRequests: [],
    exploreUsers: [],
    searchResults: [],
    isLoadingFriends: false,
    isLoadingFriendRequests: false,
    isLoadingSentRequests: false,
    isLoadingExploreUsers: false,
    isLoadingSearch: false,
    isSendingRequest: false,
    isAcceptingRequest: false,
    isRejectingRequest: false,
    isRemovingFriend: false,

    getFriends: async () => {
        set({ isLoadingFriends: true });

        try {
            const res = await axiosInstance.get("/friends/my-friends");

            set({
                friends: res.data,
            });

        } catch (error) {
            console.log("Error in getFriends:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch friends."
            );
        } finally {
            set({ isLoadingFriends: false });
        }
    },
    getFriendRequests: async () => {
        set({ isLoadingFriendRequests: true });

        try {
            const res = await axiosInstance.get("/friends/friend-requests");

            set({
                friendRequests: res.data,
            });

        } catch (error) {
            console.log("Error in getFriendRequests:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch friend requests."
            );
        } finally {
            set({ isLoadingFriendRequests: false });
        }
    },
    getSentRequests: async () => {
        set({ isLoadingSentRequests: true });

        try {
            const res = await axiosInstance.get("/friends/sent-requests");

            set({
                sentRequests: res.data,
            });

        } catch (error) {
            console.log("Error in getSentRequests:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch sent requests."
            );
        } finally {
            set({ isLoadingSentRequests: false });
        }
    },
    getExploreUsers: async (page = 1) => {
        set({ isLoadingExploreUsers: true });

        try {
            const res = await axiosInstance.get(`/user/explore?page=${page}`);

            set({
                exploreUsers: res.data,
            });

        } catch (error) {
            console.log("Error in getExploreUsers:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch users."
            );
        } finally {
            set({ isLoadingExploreUsers: false });
        }
    },
    searchUsers: async (query) => {
        if (!query.trim()) {
            set({ searchResults: [] });
            return;
        }

        set({ isLoadingSearch: true });

        try {
            const res = await axiosInstance.get(
                `/user/search?query=${encodeURIComponent(query)}`
            );

            set({
                searchResults: res.data,
            });

        } catch (error) {
            console.log("Error in searchUsers:", error);

            toast.error(
                error.response?.data?.message || "Failed to search users."
            );
        } finally {
            set({ isLoadingSearch: false });
        }
    },

    sendFriendRequest: async (userId) => {
        try {
            await axiosInstance.post(`/friends/send-request/${userId}`);

            set((state) => ({
                exploreUsers: state.exploreUsers.map((user) =>
                    user._id === userId
                        ? { ...user, relationship: "REQUEST_SENT" }
                        : user
                ),
            }));

            toast.success("Friend request sent successfully.");

        } catch (error) {
            console.log("Error in sendFriendRequest:", error);

            toast.error(
                error.response?.data?.message || "Failed to send friend request."
            );
        }
    },
    acceptFriendRequest: async (userId) => {
        try {
            const res = await axiosInstance.put(
                `/friends/accept-request/${userId}`
            );

            set((state) => {
                const acceptedUser = state.friendRequests.find(
                    (user) => user._id === userId
                );

                return {
                    friendRequests: state.friendRequests.filter(
                        (user) => user._id !== userId
                    ),

                    friends: acceptedUser
                        ? [...state.friends, acceptedUser]
                        : state.friends,

                    exploreUsers: state.exploreUsers.map((user) =>
                        user._id === userId
                            ? { ...user, relationship: "FRIENDS" }
                            : user
                    ),
                };
            });

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in acceptFriendRequest:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to accept friend request."
            );
        }
    },
    rejectFriendRequest: async (userId) => {
        try {
            const res = await axiosInstance.put(
                `/friends/reject-request/${userId}`
            );

            set((state) => ({
                friendRequests: state.friendRequests.filter(
                    (user) => user._id !== userId
                ),

                exploreUsers: state.exploreUsers.map((user) =>
                    user._id === userId
                        ? { ...user, relationship: "NONE" }
                        : user
                ),
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in rejectFriendRequest:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to reject friend request."
            );
        }
    },
    removeFriend: async (userId) => {
        try {
            const res = await axiosInstance.delete(
                `/friends/remove-friend/${userId}`
            );

            set((state) => ({
                friends: state.friends.filter(
                    (user) => user._id !== userId
                ),

                exploreUsers: state.exploreUsers.map((user) =>
                    user._id === userId
                        ? { ...user, relationship: "NONE" }
                        : user
                ),
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in removeFriend:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to remove friend."
            );
        }
    },
    subscribeToFriendEvents: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        // Friend request received
        socket.on("friendRequestReceived", () => {
            get().getFriendRequests();
        });

        // Sender's sent requests updated
        socket.on("sentRequestUpdated", () => {
            get().getSentRequests();
        });

        // Friend request accepted
        socket.on("friendRequestAccepted", () => {
            get().getFriends();
            get().getFriendRequests();
            get().getSentRequests();
            get().getExploreUsers();
        });

        // Friend request rejected
        socket.on("friendRequestRejected", () => {
            get().getFriendRequests();
            get().getSentRequests();
            get().getExploreUsers();
        });

        // Friend removed
        socket.on("friendRemoved", () => {
            get().getFriends();
            get().getExploreUsers();
        });
        //socket.off("profileUpdated");
        socket.on("profileUpdated", (updatedUser) => {
            // Update sidebar
            set((state) => ({
                friends: state.friends.map((friend) =>
                    friend._id === updatedUser._id
                        ? updatedUser
                        : friend
                ),
            }));

            // Update currently selected chat
            useChatStore.setState((state) => ({
                selectedUser:
                    state.selectedUser?._id === updatedUser._id
                        ? {
                            ...state.selectedUser,
                            ...updatedUser,
                        }
                        : state.selectedUser,

                messages: state.messages.map((message) =>
                    message.senderId?._id === updatedUser._id
                        ? {
                            ...message,
                            senderId: {
                                ...message.senderId,
                                ...updatedUser,
                            },
                        }
                        : message
                ),
            }));
        });
    },
    unsubscribeFromFriendEvents: () => {

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("friendRequestReceived");
        socket.off("sentRequestUpdated");
        socket.off("friendRequestAccepted");
        socket.off("friendRequestRejected");
        socket.off("friendRemoved");
        socket.off("profileUpdated");

    }

}));