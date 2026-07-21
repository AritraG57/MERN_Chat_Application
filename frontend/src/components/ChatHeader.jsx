import { useState } from "react";
import { X, Users } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";

import FriendProfileModal from "./FriendProfileModal";
import GroupProfileModal from "./groups/GroupProfileModal";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    
  } = useChatStore();

  // Full group details
  const { selectedGroup } = useGroupStore();

  const { onlineUsers } = useAuthStore();

  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const [showGroupProfile, setShowGroupProfile] = useState(false);

  if (!selectedUser && !selectedGroup) return null;

  return (
    <>
      <div className="p-2.5 border-b border-base-300">
        <div className="flex items-center justify-between">

          {/* Friend Header */}
          {selectedUser && (
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowFriendProfile(true)}
            >
              <div className="avatar">
                <div className="size-10 rounded-full relative">
                  <img
                    src={
                      selectedUser.profilePic ||
                      "/avatar.png"
                    }
                    alt={selectedUser.fullName}
                  />

                  {onlineUsers.includes(selectedUser._id) && (
                    <span
                      className="absolute bottom-0 right-0
                                            size-3 bg-green-500 rounded-full
                                            ring-2 ring-base-100"
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium">
                  {selectedUser.fullName}
                </h3>

                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedUser._id)
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>
          )}

          {/* Group Header */}
          {selectedGroup && (
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowGroupProfile(true)}
            >
              <div className="avatar">
                <div className="size-10 rounded-full">

                  {selectedGroup.groupPic ? (
                    <img
                      src={selectedGroup.groupPic}
                      alt={selectedGroup.groupName}
                    />
                  ) : (
                    <div className="size-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      <Users size={20} />
                    </div>
                  )}

                </div>
              </div>

              <div>
                <h3 className="font-medium">
                  {selectedGroup.groupName}
                </h3>

                <p className="text-sm text-base-content/70">
                  {selectedGroup.members?.length || 0} Members
                </p>
              </div>
            </div>
          )}

          {/* Close */}
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => {
              setSelectedUser(null);
              setSelectedGroup(null);
            }}
          >
            <X className="size-5" />
          </button>

        </div>
      </div>

      {showFriendProfile && (
        <FriendProfileModal
          onClose={() => setShowFriendProfile(false)}
        />
      )}

      {showGroupProfile && (
        <GroupProfileModal
          isOpen={showGroupProfile}
          onClose={() => setShowGroupProfile(false)}
        />
      )}
    </>
  );
};

export default ChatHeader;