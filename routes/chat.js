const path = require("path");
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

// welcome page
router.get("/", (req, res) => res.render("welcome"));

// chat route
router.get("/chat", ensureAuthenticated, (req, res) =>
  res.render("chat", {
    name: req.user.name
  })
);

module.exports = router;
