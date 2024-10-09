// Profile component
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../pages/MainLayout";

const defaultIrlProfileIcon = require("../images/Default-IRL-Profile-Icon.png");
const defaultProfileIcon = require("../images/Default-Profile-Icon.png");


const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");

        let response;
        if (username) {
          // Visiting another user's profile
          response = await axios.get(
            `http://localhost:4000/api/users/getUserInfo?username=${username}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else {
          // Visiting own profile
          response = await axios.get(
            "http://localhost:4000/api/users/getUserInfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        setUserData(response.data);
        setFollowerCount(response.data.followerCount);
        setFollowingCount(response.data.followingCount);

        const currentUsername = response.data.username;
        const storedUsername = localStorage.getItem("username");
        setIsOwnProfile(currentUsername === storedUsername);

        if (username) {
          // Check if the user is following the profile user
          const followResponse = await axios.get(
            `http://localhost:4000/api/users/followers/${
              username || response.data.username
            }`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(followResponse.data.isFollowing);
        }
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
    const token = localStorage.getItem("token");

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
        await axios.post(
          "http://localhost:4000/api/users/unfollow",
          { username },
          headers
        );
        setIsFollowing(false);
        setFollowerCount(followerCount - 1); // Decrease follower count
      } else {
        // Follow API call
        await axios.post(
          "http://localhost:4000/api/users/follow",
          { username },
          headers
        );
        setIsFollowing(true);
        setFollowerCount(followerCount + 1); // Increase follower count
      }
    } catch (error) {
      console.error("Error in follow/unfollow action", error);
    }
    setFollowLoading(false);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle file upload
  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profilePicture", selectedFile); 

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/upload-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData({
        ...userData,
        profilePicture: response.data.profilePicture,
      });

      console.log("Profile image uploaded successfully");
    } catch (error) {
      console.error("Failed to upload profile image", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MainLayout>
      <div className="flex flex-col items-center p-8 relative">
        {/* IRL Profile */}
        <div
          className="w-32 h-32 rounded-full bg-cover bg-center absolute top-8 filter blur-sm"
          style={{
            backgroundImage: `url(${defaultIrlProfileIcon})`,
            transform: "translateX(50%)",
          }}
        ></div>

        {/* Gamer Profile */}
        {isEditing ? (
          <label htmlFor="fileInput" className="cursor-pointer">
            <img
              className="w-32 h-32 rounded-full bg-cover bg-center relative z-10 mb-4"
              src={
                userData.profilePicture
                  ? `http://localhost:4000${userData.profilePicture}`
                  : defaultProfileIcon
              }
              alt={`${userData.username}'s profile`}
            />
          </label>
        ) : (
          <img
            className="w-32 h-32 rounded-full bg-cover bg-center relative z-10 mb-4"
            src={
              userData.profilePicture
                ? `http://localhost:4000${userData.profilePicture}`
                : defaultProfileIcon
            }
            alt={`${userData.username}'s profile`}
          />
        )}

        {/* Hidden File Input */}
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <h2 className="text-3xl font-bold text-slate-100">{userData.name}</h2>
        <p className="text-slate-400">@{userData.username}</p>

        {/* Edit Profile / Follow-Unfollow Button */}
        {isOwnProfile ? (
          <>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 px-4 py-2 rounded-lg bg-green-500 text-white"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-gray-500 text-white"
                >
                  Cancel
                </button>
              </>
            )}
          </>
        ) : (
          <button
            onClick={handleFollow}
            className={`mt-4 px-4 py-2 rounded-lg ${
              isFollowing ? "bg-red-500" : "bg-blue-500"
            } text-white`}
            disabled={followLoading}
          >
            {followLoading
              ? "Processing..."
              : isFollowing
              ? "Unfollow"
              : "Follow"}
          </button>
        )}

        {/* Follower and Following Counts */}
        <div className="flex flex-row gap-8 mt-4">
          <p className="text-slate-100">Followers: {followerCount}</p>
          <p className="text-slate-100">Following: {followingCount}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
