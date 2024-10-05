const express = require("express");
const { getPost, createPost, deletePost } = require('../controllers/PostController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

//Get post 
router.get('/getPost', authMiddleware, getPost);

// Create post
router.post("/createPost", authMiddleware, createPost);

// Delete post 
router.delete("/deletePost/:id", authMiddleware, deletePost);

module.exports = router;
