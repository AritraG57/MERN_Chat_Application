import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { useFriendStore } from "../store/useFriendStore";
import ExploreUserCard from "../components/friends/ExploreUserCard";

const ExplorePage = () => {
    const {
        exploreUsers,
        searchResults,
        isLoadingExploreUsers,
        isLoadingSearch,
        getExploreUsers,
        searchUsers,
    } = useFriendStore();

    const [query, setQuery] = useState("");

    // Load explore users once
    useEffect(() => {
        getExploreUsers();
    }, []);

    // Search users
    useEffect(() => {
        const delay = setTimeout(() => {
            if (query.trim()) {
                searchUsers(query);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const users =
        query.trim() === "" ? exploreUsers : searchResults;

    return (
        <div className="min-h-screen bg-base-100">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Explore Users
                    </h1>

                    <p className="text-base-content/70 mt-2">
                        Find new people and send them friend requests.
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full pl-12"
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                    />
                </div>

                {/* Loading */}
                {(isLoadingExploreUsers || isLoadingSearch) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, index) => (
                            <div
                                key={index}
                                className="card bg-base-200 shadow animate-pulse"
                            >
                                <div className="card-body items-center">
                                    <div className="w-24 h-24 rounded-full bg-base-300"></div>

                                    <div className="h-5 w-36 bg-base-300 rounded mt-4"></div>

                                    <div className="h-4 w-48 bg-base-300 rounded mt-2"></div>

                                    <div className="h-10 w-full bg-base-300 rounded mt-6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoadingExploreUsers &&
                    !isLoadingSearch &&
                    users.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">

                            <div className="text-7xl mb-6">
                                🎉
                            </div>

                            <h2 className="text-2xl font-semibold">
                                No Users Found
                            </h2>

                            <p className="text-base-content/70 mt-2">
                                {query.trim()
                                    ? "No user matches your search."
                                    : "You're already connected with everyone."}
                            </p>
                        </div>
                    )}

                {/* Users */}
                {!isLoadingExploreUsers &&
                    !isLoadingSearch &&
                    users.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {users.map((user) => (
                                <ExploreUserCard
                                    key={user._id}
                                    user={user}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ExplorePage;