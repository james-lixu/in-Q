import { useState, useEffect } from 'react';
import axios from 'axios';

const usePosts = (page, limit) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/api/posts/getPost', {
          params: { page, limit },  
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);  
        setHasMore(response.data.posts.length > 0);  
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, limit]);

  return { posts, loading, error, hasMore };
};

export default usePosts;
