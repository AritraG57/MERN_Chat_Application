import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    groupMessages: [],
    selectedUser: null,
    selectedGroup: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isGroupMessagesLoading: false,

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    setSelectedGroup: (selectedGroup) => set({ selectedGroup }),
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    getGroupMessages: async (groupId) => {
        set({ isGroupMessagesLoading: true });

        try {
            const res = await axiosInstance.get(
                `/messages/group/${groupId}`
            );

            set({
                groupMessages: res.data,
            });

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch group messages."
            );
        } finally {
            set({ isGroupMessagesLoading: false });
        }
    },
    sendGroupMessage: async (messageData) => {
        const { selectedGroup, groupMessages } = get();

        try {
            const res = await axiosInstance.post(
                `/messages/group/send/${selectedGroup._id}`,
                messageData
            );

            set({
                groupMessages: [...groupMessages, res.data],
            });

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to send group message."
            );
        }
    },
    subscribeToGroupMessages: () => {
        const { selectedGroup } = get();

        if (!selectedGroup) return;

        const socket = useAuthStore.getState().socket;

        socket.off("newGroupMessage");

        socket.on("newGroupMessage", (message) => {
            if (message.groupId !== selectedGroup._id) return;

            set({
                groupMessages: [
                    ...get().groupMessages,
                    message,
                ],
            });
        });
    },
    unsubscribeFromGroupMessages: () => {
        const socket = useAuthStore.getState().socket;

        socket.off("newGroupMessage");
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser =
                newMessage.senderId === selectedUser._id;

            if (!isMessageSentFromSelectedUser) return;

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
        // socket.off("profileUpdated");

        // socket.on("profileUpdated", (updatedUser) => {
        //     set((state) => ({
        //         selectedUser:
        //             state.selectedUser?._id === updatedUser._id
        //                 ? {
        //                     ...state.selectedUser,
        //                     ...updatedUser,
        //                 }
        //                 : state.selectedUser,

        //         messages: state.messages.map((message) => {
        //             if (typeof message.senderId === "object") {
        //                 return message.senderId._id === updatedUser._id
        //                     ? {
        //                         ...message,
        //                         senderId: {
        //                             ...message.senderId,
        //                             ...updatedUser,
        //                         },
        //                     }
        //                     : message;
        //             }

        //             return message;
        //         }),
        //     }));
        // });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("newMessage");
        //socket.off("profileUpdated");
    },
}));