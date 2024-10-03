const express = require("express");
const { userRegistration, userLogin } = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

// User Registration
router.post("/register", userRegistration) 

// User Login
router.post("/login", userLogin);

//Get user info 
router.get('/user', authMiddleware, getUserInfo);

module.exports = router;
