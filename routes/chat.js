const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Message = require("../models/Message");

// welcome page
router.get("/", (req, res) => res.render("welcome"));

// chat route
router.get("/chat", ensureAuthenticated, (req, res) => {
  Message.find({})
    .then(messages => {
      res.render("chat", {
        name: req.user.name,
        messages
      });
    })
    .catch(e => console.log(e));
});

module.exports = router;
