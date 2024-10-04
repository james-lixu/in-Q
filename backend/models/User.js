const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
      name: {
      type: String,
      required: true,
      trim: true,
    },
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
        ref: "User", 
        default: [],
      },
    ],
    gamingPreferences: {
      status: {
        type: String, 
        default: "Available",
      },
      gameList: [
        {
          type: [String],
          default: [], 
        },
      ],
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("User", UserSchema);
