const express = require('express');
const router = express.Router();
const Post = require('../models/Posts');
const authMiddleware = require('../middleware/authMiddleware');

// Get posts for the feed
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  const { username } = req.user; 

  try {
    const newPost = new Post({ username, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
