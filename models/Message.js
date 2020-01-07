const mongoose = require("mongoose");

// create schema for our messages
const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

// create a model for our messages
const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
