import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PostList = ({ posts, setPosts, username }) => { // Accept username as a prop
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null); 
  const currentUserId = localStorage.getItem("userId");

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Check if fetching posts for a specific user or all posts
      const url = username
        ? `http://localhost:4000/api/posts/getUserPosts/${username}?page=${page}&limit=5`
        : `http://localhost:4000/api/posts/getPost?page=${page}&limit=5`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const newPosts = response.data.posts || [];

      setPosts((prevPosts) => {
        const postIds = new Set(prevPosts.map((post) => post._id));
        const uniquePosts = newPosts.filter((post) => !postIds.has(post._id)); // Avoid duplicates
        return [...prevPosts, ...uniquePosts];
      });

      setHasMore(newPosts.length > 0);
      setLoading(false);
    } catch (err) {
      setError("Failed to load posts");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, username]); // Add username as a dependency

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const toggleDropdown = (postId) => {
    setDropdownOpen((prevOpen) => (prevOpen === postId ? null : postId)); 
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4000/api/posts/deletePost/${postId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDropdownOpen(null);
    } catch (error) {
      console.error("Failed to delete post", error);
      setError("Failed to delete post.");
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {posts.length === 0 && !loading && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          className="feed-item bg-black border border-slate-800 shadow-md p-4 mb-4"
        >
          <div className="flex items-center mb-2 justify-between relative">
            <div className="flex items-center">
              <Link to={`/${post.user?.username}`} className="flex items-center">
                {post.user?.profilePicture ? (
                  <img
                    src={`http://localhost:4000${post.user.profilePicture}`}
                    alt={`${post.user?.username}'s profile`}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                ) : (
                  <img
                    src="/defaultProfileIcon.png"
                    alt="Default Profile"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div className="flex flex-col gap-0 -mt-0.5">
                  <h3 className="font-extrabold text-white underline underline-offset-8">
                    {post.user.name}
                  </h3>
                  <h3 className="text-sm text-slate-400">
                    @{post.user?.username}
                  </h3>
                </div>
              </Link>
              <span className="text-text ml-4 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
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
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default PostList;
