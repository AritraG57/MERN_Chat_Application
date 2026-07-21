import { useEffect } from "react";

import { useFriendStore } from "../store/useFriendStore";

import FriendRequestCard from "../components/friends/FriendRequestCard";
import SentRequestCard from "../components/friends/SentRequestCard";

const FriendRequestsPage = () => {
    const {
        friendRequests,
        sentRequests,

        isLoadingFriendRequests,
        isLoadingSentRequests,

        getFriendRequests,
        getSentRequests,
    } = useFriendStore();

    useEffect(() => {
        getFriendRequests();
        getSentRequests();
    }, []);

    if (isLoadingFriendRequests || isLoadingSentRequests) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-7xl mx-auto px-6 py-8">

                <h1 className="text-3xl font-bold mb-8">
                    Friend Requests
                </h1>

                {/* Incoming Requests */}
                <div className="mb-12">

                    <h2 className="text-2xl font-semibold mb-6">
                        Incoming Requests
                    </h2>

                    {friendRequests.length === 0 ? (
                        <div className="card bg-base-200">
                            <div className="card-body text-center">
                                <p className="text-base-content/70">
                                    No incoming friend requests.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {friendRequests.map((request) => (
                                <FriendRequestCard
                                    key={request._id}
                                    request={request}
                                />
                            ))}
                        </div>
                    )}

                </div>

                {/* Sent Requests */}
                <div>

                    <h2 className="text-2xl font-semibold mb-6">
                        Sent Requests
                    </h2>

                    {sentRequests.length === 0 ? (
                        <div className="card bg-base-200">
                            <div className="card-body text-center">
                                <p className="text-base-content/70">
                                    No pending friend requests.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sentRequests.map((request) => (
                                <SentRequestCard
                                    key={request._id}
                                    request={request}
                                />
                            ))}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default FriendRequestsPage;