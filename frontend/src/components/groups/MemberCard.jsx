import { Crown, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useGroupStore } from "../../store/useGroupStore";
import { useAuthStore } from "../../store/useAuthStore";

const MemberCard = ({
    member,
    isMemberAdmin,
    isCurrentUserAdmin,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const { authUser } = useAuthStore();

    const {
        selectedGroup,
        removeMembers,
        makeAdmin,
        removeAdmin,
        isRemovingMembers,
        isMakingAdmin,
        isRemovingAdmin,
    } = useGroupStore();

    const isSelf = authUser._id === member._id;

    const handleRemoveMember = async () => {
        await removeMembers(selectedGroup._id, [member._id]);
        setShowMenu(false);
    };

    const handleMakeAdmin = async () => {
        await makeAdmin(selectedGroup._id, [member._id]);
        setShowMenu(false);
    };

    const handleRemoveAdmin = async () => {
        await removeAdmin(selectedGroup._id, [member._id]);
        setShowMenu(false);
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-base-300 hover:bg-base-200 transition">

            {/* Left */}
            <div className="flex items-center gap-3">
                <img
                    src={member.profilePic || "/avatar.png"}
                    alt={member.fullName}
                    className="size-12 rounded-full object-cover"
                />

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                            {member.fullName}
                        </h3>

                        {isSelf && (
                            <span className="badge badge-outline">
                                You
                            </span>
                        )}

                        {isMemberAdmin && (
                            <span className="badge badge-primary gap-1">
                                <Crown className="size-3" />
                                Admin
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-base-content/60">
                        {member.email}
                    </p>
                </div>
            </div>

            {/* Right */}
            {isCurrentUserAdmin && !isSelf && (
                <div className="relative">

                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertical className="size-5" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-base-300 bg-base-100 shadow-lg z-20">

                            {!isMemberAdmin && (
                                <button
                                    className="btn btn-ghost justify-start w-full rounded-none"
                                    onClick={handleMakeAdmin}
                                    disabled={isMakingAdmin}
                                >
                                    Make Admin
                                </button>
                            )}

                            {isMemberAdmin && (
                                <button
                                    className="btn btn-ghost justify-start w-full rounded-none"
                                    onClick={handleRemoveAdmin}
                                    disabled={isRemovingAdmin}
                                >
                                    Remove Admin
                                </button>
                            )}

                            {!isMemberAdmin && (
                                <button
                                    className="btn btn-error btn-soft justify-start w-full rounded-none"
                                    onClick={handleRemoveMember}
                                    disabled={isRemovingMembers}
                                >
                                    Remove Member
                                </button>
                            )}

                        </div>
                    )}

                </div>
            )}

        </div>
    );
};

export default MemberCard;