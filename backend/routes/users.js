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
} = require("../controllers/UserController");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;
