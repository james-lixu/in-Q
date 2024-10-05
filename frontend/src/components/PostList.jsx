import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './CreatePost';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/posts/getPost', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <CreatePost/>
      {loading ? (
        <p>Loading posts...</p>
      ) : error ? (
        <p>{error}</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="feed-item bg-slate-800 rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-2">
              <h3 className="font-bold">{post.username}</h3>
              <span className="text-gray-500 ml-2 text-sm">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;
