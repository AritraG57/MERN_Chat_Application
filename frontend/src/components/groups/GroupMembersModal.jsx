import { X, Users } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";
import { useAuthStore } from "../../store/useAuthStore";
import MemberCard from "./MemberCard";

const GroupMembersModal = ({ isOpen, onClose }) => {
    const { selectedGroup } = useGroupStore();
    const { authUser } = useAuthStore();

    if (!isOpen || !selectedGroup) return null;

    const isCurrentUserAdmin = selectedGroup.admins.some(
        (admin) => admin._id === authUser._id
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        <Users className="size-6 text-primary" />

                        <div>
                            <h2 className="text-lg font-semibold">
                                Group Members
                            </h2>

                            <p className="text-sm text-base-content/60">
                                {selectedGroup.members.length} Members
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Members */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {selectedGroup.members.length > 0 ? (
                        selectedGroup.members.map((member) => (
                            <MemberCard
                                key={member._id}
                                member={member}
                                isCurrentUserAdmin={isCurrentUserAdmin}
                                isMemberAdmin={selectedGroup.admins.some(
                                    (admin) => admin._id === member._id
                                )}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-base-content/60">
                            No members found.
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="border-t border-base-300 p-4 flex justify-end">
                    <button
                        className="btn"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

export default GroupMembersModal;