import { useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";

import { useFriendStore } from "../store/useFriendStore";
import { useGroupStore } from "../store/useGroupStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import FriendItem from "./FriendItem";
import GroupItem from "./GroupItem";
import CreateGroupModal from "./groups/CreateGroupModal";

const Sidebar = () => {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const {
    friends,
    getFriends,
    isLoadingFriends,
  } = useFriendStore();

  const {
    groups,
    getGroups,
    isLoadingGroups,
  } = useGroupStore();

  useEffect(() => {
    getFriends();
    getGroups();
  }, []);

  if (isLoadingFriends || isLoadingGroups) {
    return <SidebarSkeleton />;
  }

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col">

        {/* Header */}
        <div className="border-b border-base-300 p-5">
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <Users className="size-6" />

            <span className="hidden lg:block font-semibold text-lg">
              Chats
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Friends */}
          <div className="py-2">

            <h2 className="hidden lg:block px-4 py-2 text-xs font-semibold uppercase text-base-content/60">
              Friends
            </h2>

            {friends.length > 0 ? (
              friends.map((friend) => (
                <FriendItem
                  key={friend._id}
                  friend={friend}
                />
              ))
            ) : (
              <p className="hidden lg:block text-center text-sm text-base-content/60 py-2">
                No Friends
              </p>
            )}

          </div>

          {/* Groups */}
          <div className="py-2 border-t border-base-300">

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between px-4 py-2">

              <h2 className="text-xs font-semibold uppercase text-base-content/60">
                Groups
              </h2>

              <button
                className="btn btn-xs btn-circle btn-primary"
                onClick={() =>
                  setShowCreateGroupModal(true)
                }
              >
                <Plus className="size-4" />
              </button>

            </div>

            {/* Mobile Add Button */}
            <div className="flex justify-center py-2 lg:hidden">

              <button
                className="btn btn-circle btn-primary btn-sm"
                onClick={() =>
                  setShowCreateGroupModal(true)
                }
              >
                <Plus className="size-4" />
              </button>

            </div>

            {groups.length > 0 ? (
              groups.map((group) => (
                <GroupItem
                  key={group._id}
                  group={group}
                />
              ))
            ) : (
              <div className="hidden lg:block px-4 py-2">

                <p className="text-sm text-base-content/60 mb-3">
                  No Groups
                </p>

                <button
                  className="btn btn-sm btn-primary w-full"
                  onClick={() =>
                    setShowCreateGroupModal(true)
                  }
                >
                  Create Group
                </button>

              </div>
            )}

          </div>

        </div>

      </aside>

      <CreateGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
      />
    </>
  );
};

export default Sidebar;