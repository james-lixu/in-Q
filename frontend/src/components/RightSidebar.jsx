import React, { useState, useEffect } from "react";
import axios from "axios";
import Chatbox from "./Chatbox";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const RightSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChats, setOpenChats] = useState([]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:4000/api/users/friends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friends list:", err);
        setError("Failed to load friends list");
        setLoading(false);
      }
    };
    fetchFriendsList();
  }, []);

  const handleStartChat = async (friend) => {
    try {
      const token = localStorage.getItem("token");
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId) {
        console.error("User ID is not set in localStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/conversations/getUserConversations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let conversation = response.data.find(
        (convo) =>
          convo.participants.every((participant) => participant) &&
          convo.participants.some(
            (participant) => participant.toString() === friend._id.toString()
          ) &&
          convo.participants.some(
            (participant) => participant.toString() === currentUserId.toString()
          )
      );

      if (!conversation) {
        const createResponse = await axios.post(
          "http://localhost:4000/api/conversations/createConversation",
          { participants: [friend._id, currentUserId] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        conversation = createResponse.data;
      }

      const isChatOpen = openChats.find(
        (chat) => chat.friend._id === friend._id
      );
      if (!isChatOpen) {
        setOpenChats([
          ...openChats,
          { friend, conversationId: conversation._id },
        ]);
      }
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  // Close a Chatbox
  const handleCloseChat = (friendId) => {
    setOpenChats(openChats.filter((chat) => chat.friend._id !== friendId));
  };

  if (loading) {
    return (
    <div className="right-sidebar w-full h-screen flex flex-col justify-center items-center ">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="right-sidebar w-full h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="right-sidebar w-full h-screen">
      <h2 className="text-xl font-bold self-center mt-4 ml-2 mb-2">Friends</h2>
      <ul className="w-full">
        {friends.map((friend) => (
          <li
            key={friend._id}
            className="inline-flex items-center justify-start space-x-3 w-full p-1 pl-4 hover:bg-gray-800 rounded-md"
            onDoubleClick={() => handleStartChat(friend)}
          >
            <div className="w-10 h-8 mt-1 rounded-full overflow-hidden">
              <img
                src={
                  friend.profilePicture
                    ? `http://localhost:4000${friend.profilePicture}`
                    : "default-profile-image.png"
                }
                alt={`${friend.name}'s profile`}
                className="w-full h-full object-cover select-none"
              />
            </div>

            <div className="flex flex-col text-left w-full">
              <p className="font-bold select-none cursor-default">
                {friend.name}
              </p>
              <p className="text-sm text-gray-500 select-none">
                <Link to={`/${friend.username}`}>@{friend.username}</Link>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-0 right-0 flex space-x-2">
        {openChats.map((chat) => (
          <Chatbox
            key={chat.friend._id}
            friend={chat.friend}
            conversationId={chat.conversationId}
            onClose={() => handleCloseChat(chat.friend._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
