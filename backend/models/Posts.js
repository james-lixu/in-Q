const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true, maxlength: 280 },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
