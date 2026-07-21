import { Users } from "lucide-react";

import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

const GroupItem = ({ group }) => {
    const {
        selectedGroup,
        setSelectedGroup,
        setSelectedUser,
        getGroupMessages,
        subscribeToGroupMessages,
        unsubscribeFromGroupMessages,
        unsubscribeFromMessages,
    } = useChatStore();

    const { getGroup } = useGroupStore();

    const handleSelectGroup = async () => {
        if (selectedGroup?._id === group._id) return;

        unsubscribeFromMessages();
        unsubscribeFromGroupMessages();

        setSelectedUser(null);

        // Load complete group details
        await getGroup(group._id);

        // Keep selected chat in chat store
        setSelectedGroup(group);

        // Load messages
        await getGroupMessages(group._id);

        subscribeToGroupMessages();
    };

    return (
        <button
            onClick={handleSelectGroup}
            className={`
                w-full p-3 flex items-center justify-center lg:justify-start gap-3
                hover:bg-base-300 transition-colors
                ${
                    selectedGroup?._id === group._id
                        ? "bg-base-300 ring-1 ring-base-300"
                        : ""
                }
            `}
        >
            {/* Group Icon */}
            <div className="relative shrink-0">
                {group.groupPic ? (
                    <img
                        src={group.groupPic}
                        alt={group.groupName}
                        className="size-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="size-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <Users size={22} />
                    </div>
                )}
            </div>

            {/* Group Details (Desktop Only) */}
            <div className="hidden lg:block flex-1 text-left min-w-0">
                <h3 className="font-medium truncate">
                    {group.groupName}
                </h3>

                <p className="text-sm text-base-content/60">
                    Group Chat
                </p>
            </div>
        </button>
    );
};

export default GroupItem;