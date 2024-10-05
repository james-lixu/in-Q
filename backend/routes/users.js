const express = require("express");
const { userRegistration, userLogin, userInfo, followUser, unfollowUser, getUsername, checkFollowing } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

// User Registration
router.post("/register", userRegistration) 

// User Login
router.post("/login", userLogin);

//Get user info 
router.get('/getUserInfo', authMiddleware, userInfo);

// Follow a user
router.post('/follow', authMiddleware, followUser);

// Unfollow a user
router.post('/unfollow', authMiddleware, unfollowUser);

//Get username
router.get('/:username', getUsername);

//Check following
router.get('/followers/:username', authMiddleware, checkFollowing)

module.exports = router;
