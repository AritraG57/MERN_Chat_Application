import { useEffect, useState } from "react";
import { X, Pencil } from "lucide-react";
import { useGroupStore } from "../../store/useGroupStore";

const RenameGroupModal = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState("");

    const {
        selectedGroup,
        renameGroup,
        isRenamingGroup,
    } = useGroupStore();

    useEffect(() => {
        if (selectedGroup) {
            setGroupName(selectedGroup.groupName);
        }
    }, [selectedGroup]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName.trim()) return;

        await renameGroup(
            selectedGroup._id,
            groupName.trim()
        );

        onClose();
    };

    if (!isOpen || !selectedGroup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md mx-4">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-base-300">
                    <div className="flex items-center gap-2">
                        <Pencil className="size-5 text-primary" />

                        <h2 className="text-lg font-semibold">
                            Rename Group
                        </h2>
                    </div>

                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
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
                            className="input input-bordered w-full"
                            placeholder="Enter group name..."
                            value={groupName}
                            onChange={(e) =>
                                setGroupName(e.target.value)
                            }
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
                                groupName.trim() ===
                                    selectedGroup.groupName ||
                                isRenamingGroup
                            }
                        >
                            {isRenamingGroup
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
};

export default RenameGroupModal;