import { Check, X } from "lucide-react";
import { useFriendStore } from "../../store/useFriendStore";

const FriendRequestCard = ({ request }) => {
    const {
        acceptFriendRequest,
        rejectFriendRequest,
        isAcceptingRequest,
        isRejectingRequest,
    } = useFriendStore();

    const sender = request;

    const handleAccept = async () => {
        await acceptFriendRequest(request._id);
    };

    const handleReject = async () => {
        await rejectFriendRequest(request._id);
    };

    return (
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="card-body">

                <div className="flex items-center gap-4">

                    <div className="avatar">
                        <div className="w-16 rounded-full">
                            <img
                                src={sender.profilePic || "/avatar.png"}
                                alt={sender.fullName}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="font-semibold text-lg">
                            {sender.fullName}
                        </h2>

                        <p className="text-sm text-base-content/70 break-all">
                            {sender.email}
                        </p>
                    </div>

                </div>

                <div className="card-actions justify-end mt-6">

                    <button
                        className="btn btn-success"
                        onClick={handleAccept}
                        disabled={
                            isAcceptingRequest ||
                            isRejectingRequest
                        }
                    >
                        <Check size={18} />
                        {isAcceptingRequest
                            ? "Accepting..."
                            : "Accept"}
                    </button>

                    <button
                        className="btn btn-error"
                        onClick={handleReject}
                        disabled={
                            isAcceptingRequest ||
                            isRejectingRequest
                        }
                    >
                        <X size={18} />
                        {isRejectingRequest
                            ? "Rejecting..."
                            : "Reject"}
                    </button>

                </div>

            </div>
        </div>
    );
};

export default FriendRequestCard;

