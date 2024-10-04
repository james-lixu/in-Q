const express = require("express");
const { userRegistration, userLogin, userInfo } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

// User Registration
router.post("/register", userRegistration) 

// User Login
router.post("/login", userLogin);

//Get user info 
router.get('/getUserInfo', authMiddleware, userInfo);

module.exports = router;
