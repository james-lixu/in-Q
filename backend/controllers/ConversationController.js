const Conversation = require("../models/Conversations");
const Message = require("../models/Messages");

// Create a new conversation 
const createConversation = async (req, res) => {
  const { participants } = req.body;
  const newConversation = new Conversation({ participants });
  await newConversation.save();
  res.status(200).json(newConversation);
};

// Send a message 
const sendMessage = async (req, res) => {
  const { conversationId, senderId, message } = req.body;
  const newMessage = new Message({
    conversationId,
    sender: senderId,
    message,
  });
  await newMessage.save();

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message,
    updatedAt: Date.now(),
  });

  res.status(200).json(newMessage);
};

// Fetch message history
const getMessageHistory = async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId }).sort('createdAt');
  res.status(200).json(messages);
};

// Get all conversations for the authenticated user
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authentication middleware
    const conversations = await Conversation.find({ participants: userId }).sort('updatedAt');
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

module.exports = {
  getUserConversations
};


module.exports = {
  createConversation,
  sendMessage,
  getMessageHistory,
  getUserConversations,
}