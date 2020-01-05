const express = require("express");
const router = express.Router();

// get login route
router.get("/login", (req, res) => res.render("login"));

// get register route
router.get("/register", (req, res) => res.render("register"));

// post register route
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];

  // check required
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // check pwd match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // check pwd length
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    res.send("pass");
  }
});

module.exports = router;
