const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    message: String,  
    createdAt: { type: Date, default: Date.now },
  });
  