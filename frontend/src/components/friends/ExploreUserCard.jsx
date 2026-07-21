import { UserPlus } from "lucide-react";
import { useFriendStore } from "../../store/useFriendStore";

const ExploreUserCard = ({ user }) => {
    const {
        sendFriendRequest,
        isSendingRequest,
    } = useFriendStore();

    const handleSendRequest = async () => {
        if (user.relationship !== "NONE") return;

        await sendFriendRequest(user._id);
    };

    const getButtonText = () => {
        switch (user.relationship) {
            case "FRIENDS":
                return "Already Friends";

            case "REQUEST_SENT":
                return "Request Sent";

            case "REQUEST_RECEIVED":
                return "Check Friend Requests";

            default:
                return isSendingRequest
                    ? "Sending..."
                    : "Send Friend Request";
        }
    };

    const getButtonClass = () => {
        switch (user.relationship) {
            case "FRIENDS":
                return "btn btn-success w-full";

            case "REQUEST_SENT":
                return "btn btn-warning w-full";

            case "REQUEST_RECEIVED":
                return "btn btn-info w-full";

            default:
                return "btn btn-primary w-full";
        }
    };

    return (
        <div className="card bg-base-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="card-body items-center text-center">

                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                            src={user.profilePic || "/avatar.png"}
                            alt={user.fullName}
                        />
                    </div>
                </div>

                <h2 className="card-title mt-3">
                    {user.fullName}
                </h2>

                <p className="text-sm text-base-content/70 break-all">
                    {user.email}
                </p>

                <div className="card-actions mt-4 w-full">
                    <button
                        className={getButtonClass()}
                        disabled={
                            user.relationship !== "NONE" ||
                            isSendingRequest
                        }
                        onClick={handleSendRequest}
                    >
                        <UserPlus size={18} />

                        {getButtonText()}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ExploreUserCard;

