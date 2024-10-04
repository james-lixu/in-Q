const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 280 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
