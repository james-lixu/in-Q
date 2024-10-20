import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CreatePost from "./CreatePost";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:4000/api/posts/getPost?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

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
  }, [page]);

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

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top of the feed
  };

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      {error && <p>{error}</p>}
      {posts.length === 0 && !loading && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          className="feed-item bg-black border border-slate-800 shadow-md p-4 mb-4"
        >
          <div className="flex items-center mb-2">
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
              <h3 className="font-extrabold text-white">@{post.user?.username}</h3>
            </Link>
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
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default PostList;
