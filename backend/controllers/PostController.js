const Post = require("../models/Posts");

// Get posts for the feed
const getPost = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Create a new post
const createPost = async (req, res) => {
    const { content } = req.body;
  
    console.log('req.user:', req.user);  // Log req.user to check its value
    const { username } = req.user;  // Destructure username from req.user
  
    try {
      const newPost = new Post({ username, content });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.error('Error creating post:', err);  
      res.status(500).json({ error: 'Failed to create post' });
    }
  };
  
module.exports = {
  getPost,
  createPost,
};
