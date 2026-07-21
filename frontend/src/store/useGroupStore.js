import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useGroupStore = create((set, get) => ({
    groups: [],
    selectedGroup: null,
    availableMembers: [],
    isLoadingGroups: false,
    isLoadingGroup: false,
    isCreatingGroup: false,
    isAddingMembers: false,
    isRemovingMembers: false,
    isLeavingGroup: false,
    isDeletingGroup: false,
    isRenamingGroup: false,
    isUpdatingGroupPicture: false,
    isMakingAdmin: false,
    isRemovingAdmin: false,
    isLoadingAvailableMembers: false,
    setSelectedGroup: (selectedGroup) =>
    set({ selectedGroup }),

    getGroups: async () => {
        set({ isLoadingGroups: true });

        try {
            const res = await axiosInstance.get("/group/my-groups");

            set({
                groups: res.data,
            });

        } catch (error) {
            console.log("Error in getGroups:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch groups."
            );
        } finally {
            set({ isLoadingGroups: false });
        }
    },
    getGroup: async (groupId) => {
        set({ isLoadingGroup: true });

        try {
            const res = await axiosInstance.get(`/group/${groupId}`);

            set({
                selectedGroup: res.data,
            });

        } catch (error) {
            console.log("Error in getGroup:", error);

            toast.error(
                error.response?.data?.message || "Failed to fetch group details."
            );
        } finally {
            set({ isLoadingGroup: false });
        }
    },
    getAvailableMembers: async (groupId) => {
        set({ isLoadingAvailableMembers: true });

        try {
            const res = await axiosInstance.get(
                `/group/available-members/${groupId}`
            );

            set({
                availableMembers: res.data.availableMembers,
            });

        } catch (error) {
            console.log("Error in getAvailableMembers:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch available members."
            );
        } finally {
            set({ isLoadingAvailableMembers: false });
        }
    },
    createGroup: async (groupName) => {
        set({ isCreatingGroup: true });

        try {
            const res = await axiosInstance.post("/group/create", {
                groupName,
            });

            set((state) => ({
                groups: [...state.groups, res.data.group],
                selectedGroup: res.data.group,
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in createGroup:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to create group."
            );
        } finally {
            set({ isCreatingGroup: false });
        }
    },
    renameGroup: async (groupId, groupName) => {
        set({ isRenamingGroup: true });

        try {
            const res = await axiosInstance.put(
                `/group/rename/${groupId}`,
                { groupName }
            );

            set((state) => ({
                groups: state.groups.map((group) =>
                    group._id === groupId
                        ? { ...group, groupName: res.data.group.groupName }
                        : group
                ),

                selectedGroup:
                    state.selectedGroup?._id === groupId
                        ? {
                            ...state.selectedGroup,
                            groupName: res.data.group.groupName,
                        }
                        : state.selectedGroup,
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in renameGroup:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to rename group."
            );
        } finally {
            set({ isRenamingGroup: false });
        }
    },
    updateGroupPicture: async (groupId, groupPic) => {
        set({ isUpdatingGroupPicture: true });

        try {
            const res = await axiosInstance.put(
                `/group/update-picture/${groupId}`,
                { groupPic }
            );

            set((state) => ({
                groups: state.groups.map((group) =>
                    group._id === groupId
                        ? {
                            ...group,
                            groupPic: res.data.group.groupPic,
                        }
                        : group
                ),

                selectedGroup:
                    state.selectedGroup?._id === groupId
                        ? {
                            ...state.selectedGroup,
                            groupPic: res.data.group.groupPic,
                        }
                        : state.selectedGroup,
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in updateGroupPicture:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update group picture."
            );
        } finally {
            set({ isUpdatingGroupPicture: false });
        }
    },
    deleteGroup: async (groupId) => {
        set({ isDeletingGroup: true });

        try {
            const res = await axiosInstance.delete(`/group/${groupId}`);

            set((state) => ({
                groups: state.groups.filter(
                    (group) => group._id !== groupId
                ),

                selectedGroup:
                    state.selectedGroup?._id === groupId
                        ? null
                        : state.selectedGroup,
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in deleteGroup:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete group."
            );
        } finally {
            set({ isDeletingGroup: false });
        }
    },
    leaveGroup: async (groupId) => {
        set({ isLeavingGroup: true });

        try {
            const res = await axiosInstance.put(`/group/leave/${groupId}`);

            set((state) => ({
                groups: state.groups.filter(
                    (group) => group._id !== groupId
                ),

                selectedGroup:
                    state.selectedGroup?._id === groupId
                        ? null
                        : state.selectedGroup,
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in leaveGroup:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to leave group."
            );
        } finally {
            set({ isLeavingGroup: false });
        }
    },
    addMembers: async (groupId, memberIds) => {
        set({ isAddingMembers: true });

        try {
            const res = await axiosInstance.put(
                `/group/add-member/${groupId}`,
                { memberIds }
            );

            set((state) => ({
                selectedGroup:
                    state.selectedGroup?._id === groupId
                        ? res.data.group
                        : state.selectedGroup,

                availableMembers: state.availableMembers.filter(
                    (member) => !memberIds.includes(member._id)
                ),
            }));

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in addMembers:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add members."
            );
        } finally {
            set({ isAddingMembers: false });
        }
    },
    removeMembers: async (groupId, memberIds) => {
        set({ isRemovingMembers: true });

        try {
            const res = await axiosInstance.put(
                `/group/remove-member/${groupId}`,
                { memberIds }
            );

            set({
                selectedGroup: res.data.group,
            });

            // Refresh available members
            get().getAvailableMembers(groupId);

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in removeMembers:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to remove members."
            );
        } finally {
            set({ isRemovingMembers: false });
        }
    },
    makeAdmin: async (groupId, memberIds) => {
        set({ isMakingAdmin: true });

        try {
            const res = await axiosInstance.put(
                `/group/make-admin/${groupId}`,
                { memberIds }
            );

            set({
                selectedGroup: res.data.group,
            });

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in makeAdmin:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to make admin."
            );
        } finally {
            set({ isMakingAdmin: false });
        }
    },
    removeAdmin: async (groupId, memberIds) => {
        set({ isRemovingAdmin: true });

        try {
            const res = await axiosInstance.put(
                `/group/remove-admin/${groupId}`,
                { memberIds }
            );

            set({
                selectedGroup: res.data.group,
            });

            toast.success(res.data.message);

        } catch (error) {
            console.log("Error in removeAdmin:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to remove admin."
            );
        } finally {
            set({ isRemovingAdmin: false });
        }
    },
    subscribeToGroupEvents: () => {
        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("groupCreated");
        socket.on("groupCreated", () => {
            get().getGroups();
        });

        socket.off("groupAdded");
        socket.on("groupAdded", () => {
            get().getGroups();
        });

        socket.off("groupRemoved");
        socket.on("groupRemoved", async () => {
            await get().getGroups();

            useChatStore.getState().setSelectedGroup(null);
            useChatStore.getState().setSelectedUser(null);

            set({
                selectedGroup: null,
            });
        });

        socket.off("groupDeleted");
        socket.on("groupDeleted", async () => {
            await get().getGroups();

            set({
                selectedGroup: null,
            });

            useChatStore.getState().setSelectedGroup(null);
            useChatStore.getState().setSelectedUser(null);
        });

        socket.off("groupLeft");
        socket.on("groupLeft", () => {
            get().getGroups();

            const selectedGroup = get().selectedGroup;

            if (selectedGroup) {
                set({ selectedGroup: null });
            }
        });

        socket.off("groupRenamed");
        socket.on("groupRenamed", () => {
            get().getGroups();

            const selectedGroup = get().selectedGroup;

            if (selectedGroup) {
                get().getGroup(selectedGroup._id);
            }
        });

        socket.off("groupPictureUpdated");
        socket.on("groupPictureUpdated", () => {
            get().getGroups();

            const selectedGroup = get().selectedGroup;

            if (selectedGroup) {
                get().getGroup(selectedGroup._id);
            }
        });

        socket.off("groupMembersUpdated");
        socket.on("groupMembersUpdated", () => {
            const selectedGroup = get().selectedGroup;

            if (selectedGroup) {
                get().getGroup(selectedGroup._id);
                get().getAvailableMembers(selectedGroup._id);
            }
        });

        socket.off("groupAdminsUpdated");
        socket.on("groupAdminsUpdated", () => {
            const selectedGroup = get().selectedGroup;

            if (selectedGroup) {
                get().getGroup(selectedGroup._id);
            }
        });
    },
    unsubscribeFromGroupEvents: () => {

        const socket = useAuthStore.getState().socket;

        if (!socket) return;

        socket.off("groupCreated");
        socket.off("groupAdded");
        socket.off("groupRemoved");
        socket.off("groupDeleted");
        socket.off("groupLeft");
        socket.off("groupRenamed");
        socket.off("groupPictureUpdated");
        socket.off("groupMembersUpdated");
        socket.off("groupAdminsUpdated");

    }

}));