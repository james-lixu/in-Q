const Post = require("../models/Posts");
const User = require("../models/User");

// Get posts for a specific user
const getUserPosts = async (req, res) => {
  const { username } = req.params;  
  const { page = 1, limit = 10 } = req.query;

  try {
    console.log(`Fetching posts for username: ${username}`);

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Found user:", user);

    const posts = await Post.find({ user: user._id })
      .populate("user", "username name profilePicture")
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
      .populate("user", "username name profilePicture ")
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

    newPost = await newPost.populate("user", "username name profilePicture");

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

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Like a post
const likePost = async (req, res) => {
  const { id } = req.params; 
  const userId = req.user._id; 

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ message: "Post liked", post });
    } else {
      return res.status(400).json({ error: "Post already liked" });
    }
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
};

// Unlike a post
const unlikePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((like) => like.toString() !== userId.toString());
      await post.save();
      return res.status(200).json({ message: "Post unliked", post });
    } else {
      return res.status(400).json({ error: "Post not liked" });
    }
  } catch (err) {
    console.error("Error unliking post:", err);
    res.status(500).json({ error: "Failed to unlike post" });
  }
};

// Add a comment
const addComment = async (req, res) => {
  const { id } = req.params; 
  const { content } = req.body;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      user: userId,
      content,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ message: "Comment deleted", post });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  getPost,
  getUserPosts,  
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};
