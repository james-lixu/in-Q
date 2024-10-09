const Conversation = require("../models/Conversation");
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

  // Update the conversation with the last message and timestamp
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

// Fetch all conversations for a user
const getUserConversations = async (req, res) => {
  const { userId } = req.params;
  const conversations = await Conversation.find({ participants: userId }).sort('updatedAt');
  res.status(200).json(conversations);
};

module.exports = {
  createConversation,
  sendMessage,
  getMessageHistory,
  getUserConversations,
}