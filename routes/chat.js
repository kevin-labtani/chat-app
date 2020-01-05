const path = require("path");
const express = require("express");
const router = express.Router();

// welcome page
router.get("/", (req, res) => res.render("welcome"));

// chat route
router.get("/chat", function(req, res) {
  res.sendFile(path.join(__dirname, "../views/chat.html"));
});

module.exports = router;
