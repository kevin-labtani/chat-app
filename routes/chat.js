const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Message = require("../models/Message");

// welcome page
router.get("/", (req, res) => res.render("welcome"));

// chat route
router.get("/chat", ensureAuthenticated, async (req, res) => {
  try {
    const messages = await Message.find({});
    res.render("chat", {
      name: req.user.name,
      messages
    })
  } catch (error) {
    console.log(error);
  } 
});

module.exports = router;
