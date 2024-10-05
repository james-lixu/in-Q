const Post = require("../models/Posts");

// Get posts for the feed
const getPost = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; 

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })  
      .skip((page - 1) * limit)  
      .limit(parseInt(limit));   

    const totalPosts = await Post.countDocuments(); 
    res.status(200).json({ posts, totalPosts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Create a new post
const createPost = async (req, res) => {
    const { content } = req.body;
  
    console.log('req.user:', req.user);  
    const { username } = req.user;  
  
    try {
      const newPost = new Post({ username, content });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      console.error('Error creating post:', err);  
      res.status(500).json({ error: 'Failed to create post' });
    }
  };

  const deletePost = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Only the owner of the post can delete
      if (post.username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      }
  
      await Post.findByIdAndDelete(id);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ error: "Failed to delete post" });
    }
  };
  
module.exports = {
  getPost,
  createPost,
  deletePost,
};
