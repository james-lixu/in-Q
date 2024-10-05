const express = require("express");
const { getPost, createPost } = require('../controllers/PostController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

//Get post 
router.get('/getPost', authMiddleware, getPost);

// Create post
router.post("/createPost", authMiddleware, createPost);

module.exports = router;
