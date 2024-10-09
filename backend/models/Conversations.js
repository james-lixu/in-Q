const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: String,  
  updatedAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Conversation", ConversationSchema);
