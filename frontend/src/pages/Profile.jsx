import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../pages/MainLayout"; 

const defaultProfileIcon = require("../images/Default-Profile-Icon.png");

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const response = await axios.get(`http://localhost:4000/api/users/${username}`);
        setUserData(response.data);
  
        // Get token from localStorage (or however you're storing it)
        const token = localStorage.getItem('token');
  
        // Check if the user is following this profile user
        const followResponse = await axios.get(
          `http://localhost:4000/api/users/followers/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        setIsFollowing(followResponse.data.isFollowing);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [username]);
  

  const handleFollow = async () => {
    setFollowLoading(true);
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    
    if (!token) {
      console.error("No token found, cannot follow/unfollow");
      setFollowLoading(false);
      return;
    }
  
    try {
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      };
  
      if (isFollowing) {
        // Unfollow API call
        await axios.post('http://localhost:4000/api/users/unfollow', { username }, headers);
        setIsFollowing(false); 
      } else {
        // Follow API call
        await axios.post('http://localhost:4000/api/users/follow', { username }, headers);
        setIsFollowing(true); 
      }
    } catch (error) {
      console.error('Error in follow/unfollow action', error);
    }
    setFollowLoading(false);
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MainLayout>
      {/* Profile Content */}
      <div className="flex flex-col items-center p-8">
        <img
          src={defaultProfileIcon}
          alt="Default profile icon"
          className="w-24 h-24 rounded-full mb-4"
        />
        <h2 className="text-3xl font-bold text-slate-100">{userData.name}</h2>
        <p className="text-slate-400">@{userData.username}</p>

        {/* Follow/Unfollow Button */}
        <button
          onClick={handleFollow}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isFollowing ? "bg-red-500" : "bg-blue-500"
          } text-white`}
          disabled={followLoading}
        >
          {followLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </MainLayout>
  );
};

export default Profile;
