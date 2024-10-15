import React, { useState, useEffect } from "react";
import axios from "axios";
import Chatbox from "./Chatbox";  

const RightSidebar = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openChats, setOpenChats] = useState([]);  

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/users/friends', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch friends list:', err);
        setError('Failed to load friends list');
        setLoading(false);
      }
    };
    fetchFriendsList();
  }, []);

  const handleStartChat = async (friend) => {
    try {
      const token = localStorage.getItem("token");

      // Check if a conversation already exists
      const response = await axios.get(`http://localhost:4000/api/conversations/getUserConversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let conversation = response.data.find(convo => convo.participants.includes(friend._id));

      // If no conversation exists, create one
      if (!conversation) {
        const createResponse = await axios.post(
          "http://localhost:4000/api/conversations/createConversation",
          { participants: [friend._id] },  // Add friend as participant
          { headers: { Authorization: `Bearer ${token}` } }
        );
        conversation = createResponse.data;
      }

      const isChatOpen = openChats.find(chat => chat.friend._id === friend._id);
      if (!isChatOpen) {
        setOpenChats([...openChats, { friend, conversationId: conversation._id }]);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  // Close a Chatbox
  const handleCloseChat = (friendId) => {
    setOpenChats(openChats.filter(chat => chat.friend._id !== friendId));  
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="right-sidebar">
      <h2 className="text-xl font-bold mb-4 ml-5">Friends</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend._id} className="flex items-start space-x-4">
            <img
              src={friend.profilePicture ? `http://localhost:4000${friend.profilePicture}` : "default-profile-image.png"}
              alt={`${friend.name}'s profile`}
              className="w-10 h-10 rounded-full"
              onDoubleClick={() => handleStartChat(friend)} 
            />
            <div>
              <p className="font-bold">{friend.name}</p>
              <p className="text-sm text-gray-500 cursor-pointer">@{friend.username}</p>
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
