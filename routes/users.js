const express = require("express");
const router = express.Router();

// get login route
router.get("/login", (req, res) => res.render("login"));

// get register route
router.get("/register", (req, res) => res.render("register"));

// post register route
router.post("/register", (req, res) => {
  console.log(req.body);
  res.send("hello");
});

module.exports = router;
