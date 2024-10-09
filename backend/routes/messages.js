const express = require("express");
const { sendMessage, getMessageHistory, } = require('../controllers/MessageController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

//Get post 
router.post('/sendMessage', authMiddleware, sendMessage);

// Create post
router.get("/getMessageHistory", authMiddleware, getMessageHistory);


module.exports = router;
