import { X, Trash2, Mail, Circle } from "lucide-react";
import { useFriendStore } from "../store/useFriendStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const FriendProfileModal = ({ onClose }) => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const {
        removeFriend,
        isRemovingFriend,
    } = useFriendStore();

    if (!selectedUser) return null;

    const isOnline = onlineUsers.includes(selectedUser._id);

    const handleRemoveFriend = async () => {
        const confirmed = window.confirm(
            `Remove ${selectedUser.fullName} from your friends?`
        );

        if (!confirmed) return;

        await removeFriend(selectedUser._id);

        setSelectedUser(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded-xl shadow-2xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-base-300 p-4">
                    <h2 className="text-xl font-semibold">
                        Friend Profile
                    </h2>

                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">

                    <div className="flex flex-col items-center">

                        <div className="avatar">
                            <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img
                                    src={
                                        selectedUser.profilePic ||
                                        "/avatar.png"
                                    }
                                    alt={selectedUser.fullName}
                                />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mt-4">
                            {selectedUser.fullName}
                        </h2>

                        <div className="flex items-center gap-2 mt-2">
                            <Circle
                                className={`size-3 fill-current ${isOnline
                                        ? "text-green-500"
                                        : "text-gray-400"
                                    }`}
                            />

                            <span
                                className={
                                    isOnline
                                        ? "text-green-500"
                                        : "text-gray-400"
                                }
                            >
                                {isOnline ? "Online" : "Offline"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-5 text-base-content/70">
                            <Mail className="size-5" />
                            <span>{selectedUser.email}</span>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <button
                        className="btn btn-error w-full"
                        onClick={handleRemoveFriend}
                        disabled={isRemovingFriend}
                    >
                        <Trash2 className="size-5" />

                        {isRemovingFriend
                            ? "Removing..."
                            : "Remove Friend"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendProfileModal;

