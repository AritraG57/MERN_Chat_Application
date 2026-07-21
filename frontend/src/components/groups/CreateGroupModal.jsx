import { useState } from "react";
import { X, Users } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";

const CreateGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState("");

    const { createGroup, isCreatingGroup } = useGroupStore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName.trim()) return;

        await createGroup(groupName.trim());

        setGroupName("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        <Users className="size-6 text-primary" />
                        <h2 className="text-lg font-semibold">
                            Create Group
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-5"
                >
                    <div>
                        <label className="label">
                            <span className="label-text">
                                Group Name
                            </span>
                        </label>

                        <input
                            type="text"
                            placeholder="Enter group name..."
                            className="input input-bordered w-full"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                !groupName.trim() ||
                                isCreatingGroup
                            }
                        >
                            {isCreatingGroup
                                ? "Creating..."
                                : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;