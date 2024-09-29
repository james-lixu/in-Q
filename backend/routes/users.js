const express = require("express");
const { userRegistration, userLogin } = require('../controllers/UserController');
const router = express.Router();

// User Registration
router.post("/register", userRegistration) 

// User Login
router.post("/login", userLogin);

module.exports = router;
