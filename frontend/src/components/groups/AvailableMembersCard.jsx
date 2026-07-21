import { Check } from "lucide-react";

const AvailableMembersCard = ({
    member,
    isSelected,
    onToggle,
}) => {
    return (
        <button
            type="button"
            onClick={() => onToggle(member._id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all
                ${
                    isSelected
                        ? "border-primary bg-primary/10"
                        : "border-base-300 hover:bg-base-200"
                }`}
        >
            <div className="flex items-center gap-3">
                <img
                    src={member.profilePic || "/avatar.png"}
                    alt={member.fullName}
                    className="size-12 rounded-full object-cover"
                />

                <div className="text-left">
                    <h3 className="font-medium">
                        {member.fullName}
                    </h3>

                    <p className="text-sm text-base-content/60">
                        {member.email}
                    </p>
                </div>
            </div>

            <div
                className={`size-6 rounded-full border flex items-center justify-center
                    ${
                        isSelected
                            ? "bg-primary border-primary text-primary-content"
                            : "border-base-content/30"
                    }`}
            >
                {isSelected && <Check className="size-4" />}
            </div>
        </button>
    );
};

export default AvailableMembersCard;