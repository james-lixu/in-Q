const Post = require("../models/Posts");
const User = require("../models/User");

// Get posts for a specific user
const getUserPosts = async (req, res) => {
  const { username } = req.params;  
  const { page = 1, limit = 10 } = req.query;

  try {
    console.log(`Fetching posts for username: ${username}`);

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Found user:", user);

    const posts = await Post.find({ user: user._id })
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments({ user: user._id });

    console.log("Fetched posts:", posts);
    res.status(200).json({ posts, totalPosts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};



// Get post
const getPost = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const posts = await Post.find()
      .populate("user", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments();
    
    res.status(200).json({ posts, totalPosts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};


// Create a post
const createPost = async (req, res) => {
  const { content } = req.body;

  const userId = req.user._id; 

  try {
    const image = req.file ? `/uploads/post_images/${req.file.filename}` : null;

    let newPost = new Post({
      content,
      image,
      user: userId, 
    });

    newPost = await newPost.save();

    newPost = await newPost.populate("user", "username profilePicture");

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

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
  getUserPosts,  
  createPost,
  deletePost,
};
