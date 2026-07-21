import { useEffect, useRef } from "react";

import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    groupMessages,

    selectedUser,

    getMessages,
    getGroupMessages,

    isMessagesLoading,
    isGroupMessagesLoading,

    subscribeToMessages,
    unsubscribeFromMessages,

    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  } = useChatStore();

  const { selectedGroup } = useGroupStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  const chatMessages = selectedGroup ? groupMessages : messages;

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages(selectedGroup._id);

      subscribeToGroupMessages();

      return () => {
        unsubscribeFromGroupMessages();
      };
    }

    if (selectedUser) {
      getMessages(selectedUser._id);

      subscribeToMessages();

      return () => {
        unsubscribeFromMessages();
      };
    }
  }, [
    selectedUser,
    selectedGroup,

    getMessages,
    getGroupMessages,

    subscribeToMessages,
    unsubscribeFromMessages,

    subscribeToGroupMessages,
    unsubscribeFromGroupMessages,
  ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  if (isMessagesLoading || isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {chatMessages.map((message) => {
          const isOwnMessage =
            (message.senderId?._id || message.senderId) === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${
                isOwnMessage ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">

                  <img
                    src={
                      isOwnMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedGroup
                        ? message.senderId?.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile"
                  />

                </div>
              </div>

              <div className="chat-header mb-1">

                {selectedGroup && !isOwnMessage && (
                  <span className="text-xs font-medium mr-2">
                    {message.senderId?.fullName}
                  </span>
                )}

                <time className="text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>

              </div>

              <div className="chat-bubble flex flex-col">

                {message.image && (
                  <img
                    src={message.image}
                    alt="attachment"
                    className="sm:max-w-52 rounded-md mb-2"
                  />
                )}

                {message.text && (
                  <p>{message.text}</p>
                )}

              </div>

              <div ref={messageEndRef} />

            </div>
          );
        })}

      </div>

      <MessageInput />

    </div>
  );
};

export default ChatContainer;