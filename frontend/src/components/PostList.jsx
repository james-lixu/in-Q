import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 

  const fetchPosts = async () => {
    if (loading || !hasMore) return; 

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/posts/getPost?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      setError('Failed to load posts');
      setLoading(false);
    }
  };

  // Infinite scroll 
  useEffect(() => {
    let debounceTimeout; 

    const handleScroll = () => {
      const windowHeight = window.innerHeight + document.documentElement.scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;

      if (windowHeight >= offsetHeight - 100 && hasMore && !loading) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchPosts(nextPage); 
          return nextPage;
        });
      }
    };

    const debounceScroll = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(handleScroll, 50); 
    };

    window.addEventListener('scroll', debounceScroll);

    return () => {
      window.removeEventListener('scroll', debounceScroll); 
      clearTimeout(debounceTimeout); 
    };
  }, [hasMore, loading]);

  // Handle new post 
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post to the top of the feed
  };

  useEffect(() => {
    fetchPosts();
  }, []); 

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      {error && <p>{error}</p>}
      {posts.length === 0 && !loading && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post._id} className="feed-item bg-black border border-slate-800 shadow-md p-4 mb-4">
          <div className="flex items-center mb-2">
            <h3 className="font-bold">{post.username}</h3>
            <span className="text-text ml-2 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          <p>{post.content}</p>
        </div>
      ))}
      {loading && <p>Loading more posts...</p>}
    </div>
  );
};

export default PostList;
