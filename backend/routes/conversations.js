const express = require("express");
const { createConversation, sendMessage, getMessageHistory, getUserConversations} = require('../controllers/ConversationController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

//Create convo
router.post('/createConversation', authMiddleware, createConversation);

//Send message 
router.post('/sendMessage', authMiddleware, sendMessage);

// Get message history
router.get("/getMessageHistory/:conversationId", authMiddleware, getMessageHistory);

//Get all conversations
router.get("/getUserConversations", authMiddleware, getUserConversations);

module.exports = router;
