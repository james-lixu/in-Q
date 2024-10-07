import React, { useState, useEffect } from "react";
import axios from "axios";

const RightSidebar = () => {
  const [friends, setFriends] = useState([]); 
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

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

  if (loading) return <p>Loading...</p>;
  
  if (error) return <p>{error}</p>;

  return (
    <div className="right-sidebar">
      <h2 className="text-xl font-bold mb-4 ml-5">Friends</h2>
      <ul>
        {friends.map(friend => (
          <li key={friend._id} className="flex items-start space-x-4">
            <img
              src={friend.profileImage || "default-profile-image.png"} 
              alt={`${friend.name}'s profile`}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-bold">{friend.name}</p>
              <p className="text-sm text-gray-500">@{friend.username}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
