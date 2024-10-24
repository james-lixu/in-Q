const express = require("express");
const { getPost, createPost, deletePost, getUserPosts, likePost, unlikePost, addComment, deleteComment } = require('../controllers/PostController');
const upload = require('../middleware/fileUploadMiddleware'); 
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

//Get post 
router.get('/getPost', authMiddleware, getPost);

// Create post route
router.post('/createPost', authMiddleware, (req, res, next) => {
    req.folder = 'uploads/post_images/';  
    next();
  }, upload.single('image'), createPost);

// Delete post 
router.delete("/deletePost/:id", authMiddleware, deletePost);

//Get specifific user's posts
router.get("/getUserPosts/:username", authMiddleware, getUserPosts);

// Like a post
router.put("/likePost/:id", authMiddleware, likePost);

// Unlike a post
router.put("/unlikePost/:id",authMiddleware, unlikePost);

// Add a comment to a post
router.post("/comment/:id", authMiddleware, addComment);

// Delete a comment
router.delete("/comment/:postId/:commentId", authMiddleware, deleteComment);

module.exports = router;
