const express = require("express");
const {
  userRegistration,
  userLogin,
  userLogout,
  userInfo,
  followUser,
  unfollowUser,
  getUsername,
  checkFollowing,
  checkFriendship,
  getFriendsList,
  uploadProfilePicture,
  updateBio,
  searchUser
} = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require('../middleware/fileUploadMiddleware'); 
const router = express.Router();

// User Registration
router.post("/register", userRegistration);

// User Login
router.post("/login", userLogin);

// User Login
router.post("/logout", userLogout);

//Get user info
router.get("/getUserInfo", authMiddleware, userInfo);

// Follow a user
router.post("/follow", authMiddleware, followUser);

// Unfollow a user
router.post("/unfollow", authMiddleware, unfollowUser);

//Get username
router.get("/user/:username", authMiddleware, getUsername);

//Check following
router.get("/followers/:username", authMiddleware, checkFollowing);

//Check friendship
router.get("/check-friendship/:username", authMiddleware, checkFriendship);

//Get friends list
router.get("/friends", authMiddleware, getFriendsList);

// Profile image upload (protected route)
router.post('/upload-profile-image', authMiddleware, (req, res, next) => {
  req.folder = 'uploads/profile_pictures/';  
  next();
}, upload.single('profilePicture'), uploadProfilePicture); 

// Updating bio
router.post("/update-bio", authMiddleware, updateBio);

// Search query for users
router.get("/search", authMiddleware, searchUser);

module.exports = router;
