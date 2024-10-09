const Message = require("../models/Messages");

//Send a message
const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  const newMessage = new Message({
    sender: senderId,
    receiver: receiverId,
    message,
  });
  await newMessage.save();
  res.status(200).json(newMessage);
};

//Get message history
const getMessageHistory = async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  }).sort("createdAt");
  res.status(200).json(messages);
};

module.exports = {
  sendMessage,
  getMessageHistory
};
