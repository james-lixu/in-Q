import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPhotoVideo, FaVideo, FaStream, FaCalendarAlt } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const defaultProfileIcon = require("../images/Default-Profile-Icon.png");

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/posts/createPost",
        { content },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setContent("");
      setLoading(false);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err) {
      setError("Failed to create post");
      setLoading(false);
    }
  };

  return (
    <div className="border border-slate-800 rounded-xl p-2 mb-4">
      <form
        onSubmit={handleSubmit}
        className="bg-dark p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center mb-4">
          <img
            src={
              user && user.profilePicture
                ? `http://localhost:4000${user.profilePicture}`
                : defaultProfileIcon
            }
            alt="Profile icon"
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-full cursor-pointer"
            onClick={() => navigate(`/${user.username}`)}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow ml-4 p-2 bg-gray-800 rounded-lg text-text focus:outline-none"
            placeholder="Type here..."
          />
        </div>

        {/* Error message */}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-between mt-4">
          <div className="flex gap-4">
            <button type="button" className="flex items-center text-neon-green">
              <FaPhotoVideo className="mr-1" /> Photo
            </button>

            <button type="button" className="flex items-center text-primary">
              <FaVideo className="mr-1" /> Video
            </button>

            <button type="button" className="flex items-center text-secondary">
              <FaStream className="mr-1" /> Thread
            </button>

            <button type="button" className="flex items-center text-accent">
              <FaCalendarAlt className="mr-1" /> Schedule
            </button>
          </div>

          {/* Post button */}
          <button
            type="submit"
            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-600"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
