const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
      trim: true,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        default: [],
      },
    ],
    gamingPreferences: {
      status: {
        type: String, //  "Available", "Busy", etc.
        default: "Available",
      },
      gameList: [
        {
          type: [String],
          default: [], // Array of game titles
        },
      ],
    },
  },
  { timestamps: true }
); 

// Create and export the User model
const User = mongoose.model("User", UserSchema);
module.exports = User;
