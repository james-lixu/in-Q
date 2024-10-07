import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../pages/MainLayout"; 

const defaultProfileIcon = require("../images/Default-Profile-Icon.png");
const defaultIrlProfileIcon = require("../images/Default-IRL-Profile-Icon.png");

const Profile = () => {
  const { username } = useParams(); // Get username from URL if visiting another profile
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 

        let response;
        if (username) {
          // Visiting another user's profile
          response = await axios.get(`http://localhost:4000/api/users/getUserInfo?username=${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Visiting own profile
          response = await axios.get('http://localhost:4000/api/users/getUserInfo', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        setUserData(response.data);
        setFollowerCount(response.data.followerCount); 
        setFollowingCount(response.data.followingCount); 
  
        // Check following
        const followResponse = await axios.get(
          `http://localhost:4000/api/users/followers/${username || response.data.username}`,
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
    const token = localStorage.getItem('token'); 
    
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
        setFollowerCount(followerCount - 1); // Decrease follower count
      } else {
        // Follow API call
        await axios.post('http://localhost:4000/api/users/follow', { username }, headers);
        setIsFollowing(true); 
        setFollowerCount(followerCount + 1); // Increase follower count
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
      <div className="flex flex-col items-center p-8 relative">
        {/* IRL Profile (Blurred and offset) */}
        <div 
          className="w-24 h-24 rounded-full bg-cover bg-center absolute top-8 filter blur-sm" 
          style={{ backgroundImage: `url(${defaultIrlProfileIcon})`, transform: "translateX(50%)" }}
        ></div>
        
        {/* Gamer Profile */}
        <div 
          className="w-24 h-24 rounded-full bg-cover bg-center relative z-10 mb-4" 
          style={{ backgroundImage: `url(${defaultProfileIcon})` }}
        ></div>

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

        {/* Follower and Following Counts */}
        <div className="mt-4">
          <p className="text-slate-100">Followers: {followerCount}</p>
          <p className="text-slate-100">Following: {followingCount}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
