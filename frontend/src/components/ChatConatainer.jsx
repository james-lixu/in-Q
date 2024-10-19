import React, { useState } from "react";
import Chatbox from "./Chatbox"; 

const ChatContainer = ({ friends }) => {
  const [openChats, setOpenChats] = useState([]);

  const openChat = (friend) => {
    if (!openChats.find((chat) => chat.friend._id === friend._id)) {
      setOpenChats([...openChats, { friend, conversationId: friend.conversationId }]);
    }
  };

  const closeChat = (conversationId) => {
    setOpenChats(openChats.filter((chat) => chat.conversationId !== conversationId));
  };

  return (
    <div className="chat-container fixed bottom-0 right-0 flex p-4">
      {openChats.map((chat, index) => (
        <Chatbox
          key={chat.conversationId}
          friend={chat.friend}
          conversationId={chat.conversationId}
          onClose={() => closeChat(chat.conversationId)}
        />
      ))}
    </div>
  );
};

export default ChatContainer;
