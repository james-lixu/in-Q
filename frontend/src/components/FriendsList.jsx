import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/users/friends", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, []);

  const handleStartConversation = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/conversations/createConversation",
        { participants: [friendId] },  
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate("/messages");  
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };  

  if (loading) return <p>Loading friends...</p>;

  return (
    <div className="friend-list-container">
      <h2 className="text-2xl font-bold mb-4">Select a Friend to Start a Conversation</h2>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <div className="friend-list">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="friend-item cursor-pointer border-b border-gray-300 p-4"
              onClick={() => handleStartConversation(friend._id)}
            >
              <p>{friend.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendList;
