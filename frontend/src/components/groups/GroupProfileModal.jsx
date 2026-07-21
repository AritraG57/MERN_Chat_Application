import { useRef, useState } from "react";
import {
    Camera,
    LogOut,
    Pencil,
    Trash2,
    Users,
    X,
} from "lucide-react";

import { useGroupStore } from "../../store/useGroupStore";
import { useAuthStore } from "../../store/useAuthStore";

import GroupMembersModal from "./GroupMembersModal";
import RenameGroupModal from "./RenameGroupModal";
import AddMembersModal from "./AddMembersModal";

const GroupProfileModal = ({ isOpen, onClose }) => {
    const fileInputRef = useRef(null);

    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showAddMembersModal, setShowAddMembersModal] = useState(false);

    const { authUser } = useAuthStore();

    const {
        selectedGroup,
        leaveGroup,
        deleteGroup,
        updateGroupPicture,
        isLeavingGroup,
        isDeletingGroup,
        isUpdatingGroupPicture,
    } = useGroupStore();

    if (!isOpen || !selectedGroup) return null;

    const isAdmin =
        selectedGroup.admins?.some(
            (admin) => admin._id === authUser._id
        ) || false;

    const handleImageUpload = async (e) => {
        if (isUpdatingGroupPicture) return;

        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async () => {
            await updateGroupPicture(
                selectedGroup._id,
                reader.result
            );
        };

        reader.readAsDataURL(file);
    };

    const handleLeaveGroup = async () => {
        if (
            !window.confirm(
                "Are you sure you want to leave this group?"
            )
        )
            return;

        await leaveGroup(selectedGroup._id);
        onClose();
    };

    const handleDeleteGroup = async () => {
        if (
            !window.confirm(
                "Delete this group permanently?"
            )
        )
            return;

        await deleteGroup(selectedGroup._id);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md mx-4">

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-base-300">
                        <h2 className="text-xl font-semibold">
                            Group Info
                        </h2>

                        <button
                            className="btn btn-circle btn-sm btn-ghost"
                            onClick={onClose}
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">

                        {/* Group Picture */}
                        <div className="flex flex-col items-center gap-3">

                            <div className="relative">

                                <img
                                    src={
                                        selectedGroup.groupPic ||
                                        "/avatar.png"
                                    }
                                    alt="Group"
                                    className={`size-28 rounded-full object-cover border-4 transition-opacity duration-200 ${isUpdatingGroupPicture
                                            ? "opacity-50"
                                            : ""
                                        }`}
                                />

                                {/* Loading Overlay */}
                                {isUpdatingGroupPicture && (
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                        <span className="loading loading-spinner loading-lg text-white"></span>
                                    </div>
                                )}

                                {isAdmin && (
                                    <>
                                        <button
                                            className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm"
                                            disabled={isUpdatingGroupPicture}
                                            onClick={() =>
                                                fileInputRef.current.click()
                                            }
                                        >
                                            <Camera className="size-4" />
                                        </button>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </>
                                )}

                            </div>

                            <h2 className="text-xl font-bold">
                                {selectedGroup.groupName}
                            </h2>

                            <p className="text-sm opacity-70">
                                {selectedGroup.members?.length || 0} Members
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="space-y-3">

                            <button
                                className="btn btn-outline w-full justify-start"
                                onClick={() =>
                                    setShowMembersModal(true)
                                }
                            >
                                <Users className="size-5" />
                                View Members
                            </button>

                            {isAdmin && (
                                <>
                                    <button
                                        className="btn btn-outline w-full justify-start"
                                        onClick={() =>
                                            setShowRenameModal(true)
                                        }
                                    >
                                        <Pencil className="size-5" />
                                        Rename Group
                                    </button>

                                    <button
                                        className="btn btn-outline w-full justify-start"
                                        onClick={() =>
                                            setShowAddMembersModal(true)
                                        }
                                    >
                                        <Users className="size-5" />
                                        Add Members
                                    </button>

                                    <button
                                        className="btn btn-outline w-full justify-start"
                                        disabled={isUpdatingGroupPicture}
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        <Camera className="size-5" />
                                        {isUpdatingGroupPicture
                                            ? "Updating..."
                                            : "Change Group Picture"}
                                    </button>
                                </>
                            )}

                            <button
                                className="btn btn-warning w-full justify-start"
                                disabled={isLeavingGroup}
                                onClick={handleLeaveGroup}
                            >
                                <LogOut className="size-5" />
                                Leave Group
                            </button>

                            {isAdmin && (
                                <button
                                    className="btn btn-error w-full justify-start"
                                    disabled={isDeletingGroup}
                                    onClick={handleDeleteGroup}
                                >
                                    <Trash2 className="size-5" />
                                    Delete Group
                                </button>
                            )}

                        </div>

                    </div>

                </div>
            </div>

            <GroupMembersModal
                isOpen={showMembersModal}
                onClose={() => setShowMembersModal(false)}
            />

            <RenameGroupModal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
            />

            <AddMembersModal
                isOpen={showAddMembersModal}
                onClose={() => setShowAddMembersModal(false)}
            />
        </>
    );
};

export default GroupProfileModal;