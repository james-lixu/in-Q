import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MainLayout from "../pages/MainLayout";
import PFPEdit from "../images/PFP-Edit.svg";
import ProfileEditIcon from "../images/Profile-Edit.svg";

const defaultProfileIcon = require("../images/Default-Profile-Icon.png");

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

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
        setBio(response.data.bio || "");
        setFollowerCount(response.data.followerCount);
        setFollowingCount(response.data.followingCount);

        const currentUsername = response.data.username;
        const storedUsername = localStorage.getItem("username");
        setIsOwnProfile(currentUsername === storedUsername);

        // Fetch user's posts
        const postsResponse = await axios.get(
          `http://localhost:4000/api/posts/getUserPosts/${response.data.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(postsResponse.data.posts);

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
    const file = event.target.files[0];
    setSelectedFile(file);

    // Preview the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }

    try {
      if (selectedFile) {
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
      }

      if (bio) {
        const response = await axios.post(
          "http://localhost:4000/api/users/update-bio",
          { bio },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData({
          ...userData,
          bio: response.data.bio,
        });

        console.log("Bio updated successfully");
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }

    setIsEditing(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <MainLayout>
      <div className="flex flex-col items-center relative">
        <div className="relative w-full flex justify-center">
          {/* Profile Picture */}
          {isEditing ? (
            <label htmlFor="fileInput" className="cursor-pointer">
              <img
                className="w-32 h-32 rounded-full bg-cover bg-center relative z-10 mb-2"
                src={
                  previewImage ||
                  (userData.profilePicture
                    ? `http://localhost:4000${userData.profilePicture}`
                    : defaultProfileIcon)
                }
                alt={`${userData.username}'s profile`}
              />
              <div className="absolute inset-0 h-32 bg-black bg-opacity-50 rounded-full flex justify-center items-center z-20 before:content-[''] before:absolute before:inset-0 before:bg-black before:rounded-full before:blur-2xl before:opacity-60 before:transition-opacity before:duration-300 hover:before:opacity-5">
                <img src={PFPEdit} alt="Edit Icon" className="h-8 w-8"></img>
              </div>
            </label>
          ) : (
            <img
              className="w-32 h-32 rounded-full bg-cover bg-center relative z-10"
              src={
                userData.profilePicture
                  ? `http://localhost:4000${userData.profilePicture}`
                  : defaultProfileIcon
              }
              alt={`${userData.username}'s profile`}
            />
          )}

          {/* Edit Icon */}
          {isOwnProfile && !isEditing && (
            <svg 
            className="absolute top-0 right-0 w-7 h-7 cursor-pointer mr-4 transition-all hover:stroke-white stroke-[#6b7280]" 
            aria-hidden="true" 
            onClick={() => setIsEditing(true)}
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
            />
          </svg>          
          )}

          {/* File input only when editing */}
          {isEditing && (
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          )}
        </div>

        {/* Profile Name */}
        <div className="relative flex justify-center items-center mt-2 w-full">
          <h2 className="text-3xl font-bold text-text">{userData.name}</h2>
        </div>

        <p className="text-slate-400">@{userData.username}</p>

        {/* Bio */}
        {isOwnProfile && isEditing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-gray-800 p-2 rounded-lg w-full mt-2"
            placeholder="Add a bio..."
          />
        ) : (
          <p className="text-text mt-2">
            {userData.bio || "No bio available."}
          </p>
        )}

        {/* Follower and Following Counts */}
        <div className="flex flex-row gap-8 mt-4">
          <p className="text-text">Followers: {followerCount}</p>
          <p className="text-text">Following: {followingCount}</p>
        </div>

        {/* Edit Profile / Follow-Unfollow Button */}
        {isOwnProfile ? (
          <>
            {!isEditing ? (
              <h1></h1>
            ) : (
              <div className="flex flex-row space-x-2">
                <button
                  onClick={handleProfileUpdate}
                  className="mt-2 px-6 py-2 rounded-lg bg-accent text-text"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-secondary text-text"
                >
                  Cancel
                </button>
              </div>
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

        {/* User's Posts */}
        <div className="w-full mt-6">
          <h3 className="flex text-xl font-bold text-text mb-4 self-center">
            Posts
          </h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="feed-item bg-black border border-slate-800 shadow-md p-4 mb-4"
              >
                <div className="flex items-center mb-2">
                  {/* Display username and profile picture */}
                  <img
                    src={`http://localhost:4000${
                      post.user?.profilePicture || defaultProfileIcon
                    }`}
                    alt={`${post.user?.username}'s profile`}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <h3 className="font-bold text-text">
                    @{post.user?.username}
                  </h3>
                  <span className="text-text ml-2 text-sm">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="ml-4 whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <div className="flex justify-center">
                    <img
                      src={`http://localhost:4000${post.image}`}
                      alt="Post"
                      className="mt-4 w-[90%] h-1/2 rounded-lg mx-auto"
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-400 mt-2">No posts yet.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
