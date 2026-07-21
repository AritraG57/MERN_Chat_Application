import { Clock } from "lucide-react";

const SentRequestCard = ({ request }) => {
    const receiver = request;

    return (
        <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="card-body">

                <div className="flex items-center gap-4">

                    <div className="avatar">
                        <div className="w-16 rounded-full">
                            <img
                                src={receiver.profilePic || "/avatar.png"}
                                alt={receiver.fullName}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <h2 className="font-semibold text-lg">
                            {receiver.fullName}
                        </h2>

                        <p className="text-sm text-base-content/70 break-all">
                            {receiver.email}
                        </p>
                    </div>

                </div>

                <div className="card-actions justify-end mt-6">

                    <button
                        className="btn btn-outline btn-warning"
                        disabled
                    >
                        <Clock size={18} />
                        Pending
                    </button>

                </div>

            </div>
        </div>
    );
};

export default SentRequestCard;
