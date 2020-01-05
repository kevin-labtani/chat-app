const path = require("path");
const express = require("express");
const router = express.Router();

// welcome page
router.get("/", (req, res) => res.render("welcome"));

// chat route
router.get("/chat", (req, res) => res.render("chat"));

module.exports = router;
