import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";

const FriendItem = ({ friend }) => {
    const { onlineUsers } = useAuthStore();

    const {
        selectedUser,
        setSelectedUser,
        setSelectedGroup,
        getMessages,
        subscribeToMessages,
        unsubscribeFromMessages,
        unsubscribeFromGroupMessages,
    } = useChatStore();

    const {
        setSelectedGroup: setGroupSelectedGroup,
    } = useGroupStore();

    const isOnline = onlineUsers.includes(friend._id);

    const handleSelectFriend = async () => {
        unsubscribeFromGroupMessages();
        unsubscribeFromMessages();

        // Clear selected group from BOTH stores
        setSelectedGroup(null);
        setGroupSelectedGroup(null);

        // Select the friend
        setSelectedUser(friend);

        // Load messages
        await getMessages(friend._id);

        subscribeToMessages();
    };

    return (
        <button
            onClick={handleSelectFriend}
            className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === friend._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
            `}
        >
            <div className="relative">
                <img
                    src={friend.profilePic || "/avatar.png"}
                    alt={friend.fullName}
                    className="size-12 rounded-full object-cover"
                />

                {isOnline && (
                    <span
                        className="absolute bottom-0 right-0
                        size-3 bg-green-500 rounded-full
                        ring-2 ring-base-100"
                    />
                )}
            </div>

            <div className="flex-1 text-left min-w-0">
                <h3 className="font-medium truncate">
                    {friend.fullName}
                </h3>
            </div>
        </button>
    );
};

export default FriendItem;