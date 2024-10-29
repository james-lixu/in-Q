import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import ReportIcon from "../images/Flag-Icon.svg";
import { useUser } from "../context/UserContext";

const PostList = ({ posts, setPosts, username }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const url = username
        ? `http://localhost:4000/api/posts/getUserPosts/${username}?page=${page}&limit=5`
        : `http://localhost:4000/api/posts/getPost?page=${page}&limit=5`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const newPosts = response.data.posts || [];

      setPosts((prevPosts) => {
        const postIds = new Set(prevPosts.map((post) => post._id));
        const uniquePosts = newPosts.filter((post) => !postIds.has(post._id));
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
  }, [page, username]);

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
      await axios.delete(
        `http://localhost:4000/api/posts/deletePost/${postId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setDropdownOpen(null);
    } catch (error) {
      console.error("Failed to delete post", error);
      setError("Failed to delete post.");
    }
  };

  const handleLikePost = async (post) => {
    try {
      const isLiked = post.likedByCurrentUser;
  
      const url = isLiked
        ? `http://localhost:4000/api/posts/unlikePost/${post._id}`
        : `http://localhost:4000/api/posts/likePost/${post._id}`;
  
      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((userId) => userId !== user._id)
                  : [...p.likes, user._id], 
                likedByCurrentUser: !isLiked, // Toggle like state
              }
            : p
        )
      );
  
      console.log("Post likes after update:", post.likes);
    } catch (err) {
      console.error("Error liking/unliking post:", err);
    }
  };
  
  return (
    <div>
      {error && <p>{error}</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => {
        const isLiked = post.likedByCurrentUser;
        return (
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
                  <div className="flex flex-col gap-0 -mt-0.5 ">
                    <h3 className="font-extrabold text-white underline underline-offset-8 transition-opacity duration-300 hover:opacity-85">
                      {post.user.name}
                    </h3>
                    <h3 className="text-sm text-slate-400 hover:text-blue-500">
                      @{post.user?.username}
                    </h3>
                  </div>
                </Link>
                <span className="text-text ml-4 text-sm">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Dropdown Menu */}
              <div className="relative">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
                  onClick={() => toggleDropdown(post._id)}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1"
                    d="M6 12h.01m6 0h.01m5.99 0h.01"
                  />
                </svg>
                {dropdownOpen === post._id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-background border border-gray-300 rounded shadow-lg"
                  >
                    <ul className="py-1">
                      <li className="px-4 py-2 hover:bg-slate-700 cursor-pointer">
                        Edit Post
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-slate-700 cursor-pointer"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete Post
                      </li>
                    </ul>
                  </div>
                )}
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
            <div className="post-interaction flex justify-between mt-6">
              <div className="like-comment flex flex-row gap-6 ml-2 pb-1">
                <svg
                  className={`w-6 h-6 transition duration-300 ease-in-out transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,105,180,0.7)] ${
                    isLiked ? "text-red-500" : "text-gray-800 dark:text-white"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => handleLikePost(post)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                  />
                </svg>

                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white transition duration-300 ease-in-out transform hover:scale-110 hover:text-neon-green hover:drop-shadow-[0_0_8px_rgba(0,255,0,0.7)]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 10.5h.01m-4.01 0h.01M8 10.5h.01M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-6.6a1 1 0 0 0-.69.275l-2.866 2.723A.5.5 0 0 1 8 18.635V17a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  />
                </svg>
              </div>
              <img src={ReportIcon} alt="Report icon" className="w-7 h-7"></img>
            </div>
          </div>
        );
      })}

      {loading && (
        <div className="flex justify-center items-center my-4">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default PostList;
