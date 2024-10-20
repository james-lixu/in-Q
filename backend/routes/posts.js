const express = require("express");
const { getPost, createPost, deletePost, getUserPosts } = require('../controllers/PostController');
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
router.get("/getUserPosts/:username", getUserPosts);

module.exports = router;
