const Conversation = require("../models/Conversations");
const Message = require("../models/Messages");
const mongoose = require("mongoose");

// Create a new conversation 
const createConversation = async (req, res) => {
  const { participants } = req.body;
  
  const validParticipants = participants.filter(participant => participant);

  if (validParticipants.length < 2) {
    return res.status(400).json({ error: 'Invalid participants, both users must be valid' });
  }

  try {
    const newConversation = new Conversation({ participants: validParticipants });
    await newConversation.save();
    res.status(200).json(newConversation);
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  const { conversationId, message } = req.body;
  console.log("Sending message to conversation:", conversationId);
  console.log("Message content:", message);

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: 'Invalid conversationId' });
  }

  try {
    const newMessage = new Message({
      conversationId,
      sender: req.user._id, 
      message,
    });
    await newMessage.save();

    const populatedMessage = await newMessage.populate('sender', 'name username');

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message,
      updatedAt: Date.now(),
    });

    res.status(200).json(populatedMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get message history
const getMessageHistory = async (req, res) => {
  const { conversationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ error: 'Invalid conversationId' });
  }

  try {
    // Fetch and populate the sender for each message
    const messages = await Message.find({ conversationId })
      .populate('sender', 'name username')
      .sort('createdAt');

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching message history:", err);
    res.status(500).json({ error: "Failed to fetch message history" });
  }
};


// Get all conversations for the authenticated user
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;  
    console.log("Fetching conversations for user:", userId);
    const conversations = await Conversation.find({ participants: userId }).sort('updatedAt');
    console.log("Fetched conversations:", conversations);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getMessageHistory,
  getUserConversations,
};
