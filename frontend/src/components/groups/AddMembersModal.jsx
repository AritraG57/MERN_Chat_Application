import { useEffect, useState } from "react";
import { Users, X } from "lucide-react";

import { useGroupStore } from "../../store/useGroupStore";
import AvailableMembersCard from "./AvailableMembersCard";

const AddMembersModal = ({ isOpen, onClose }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    const {
        selectedGroup,
        availableMembers,
        getAvailableMembers,
        addMembers,
        isLoadingAvailableMembers,
        isAddingMembers,
    } = useGroupStore();

    useEffect(() => {
        if (isOpen && selectedGroup) {
            getAvailableMembers(selectedGroup._id);
            setSelectedMembers([]);
        }
    }, [isOpen, selectedGroup]);

    if (!isOpen || !selectedGroup) return null;

    const handleToggle = (memberId) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) return;

        await addMembers(selectedGroup._id, selectedMembers);

        setSelectedMembers([]);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-base-300">

                    <div className="flex items-center gap-2">
                        <Users className="size-6 text-primary" />

                        <div>
                            <h2 className="text-lg font-semibold">
                                Add Members
                            </h2>

                            <p className="text-sm text-base-content/60">
                                Select friends to add
                            </p>
                        </div>
                    </div>

                    <button
                        className="btn btn-circle btn-sm btn-ghost"
                        onClick={onClose}
                    >
                        <X className="size-5" />
                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                    {isLoadingAvailableMembers ? (

                        <div className="text-center py-10">
                            Loading...
                        </div>

                    ) : availableMembers.length === 0 ? (

                        <div className="text-center py-10 text-base-content/60">
                            No friends available to add.
                        </div>

                    ) : (

                        availableMembers.map((member) => (
                            <AvailableMembersCard
                                key={member._id}
                                member={member}
                                isSelected={selectedMembers.includes(member._id)}
                                onToggle={handleToggle}
                            />
                        ))

                    )}

                </div>

                {/* Footer */}

                <div className="border-t border-base-300 p-4 flex justify-end gap-3">

                    <button
                        className="btn btn-ghost"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn btn-primary"
                        disabled={
                            selectedMembers.length === 0 ||
                            isAddingMembers
                        }
                        onClick={handleAddMembers}
                    >
                        {isAddingMembers
                            ? "Adding..."
                            : `Add ${selectedMembers.length || ""} Member${selectedMembers.length === 1 ? "" : "s"}`}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default AddMembersModal;