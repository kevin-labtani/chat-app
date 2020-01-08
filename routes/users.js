const express = require("express");
const router = express.Router();
const validator = require("validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// get login route
router.get("/login", (req, res) => res.render("login"));

// get register route
router.get("/register", (req, res) => res.render("register"));

// post register route
router.post("/register", async (req, res) => {
  let { name, email, password, password2 } = req.body;

  let errors = [];

  // check required
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  // validate name
  name = name.trim();
  // name must be unique
  const user = await User.findOne({ name });
  if (user) {
    // user already exists
    errors.push({ msg: "Name already registered" });
  }

  const regSafe = /[\^<,\"@\/\{\}\(\)\*\$%\?=>:\|]+/i;
  if (regSafe.test(name)) {
    errors.push({ msg: "Please enter a valid name" });
  }

  // validate email
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    // user already exists
    errors.push({ msg: "Email already registered" });
  }
  if (!validator.isEmail(email)) {
    errors.push({ msg: "Please enter a valid email" });
  }

  // check pwd match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  // check pwd length
  if (!validator.isLength(password, { min: 6, max: 15 })) {
    errors.push({ msg: "Password must between 6 and 15 characters" });
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
    // validation passed

    // instantiate new user and save them to db
    const newUser = new User({
      name: name,
      email,
      password
    });

    try {
      // hash password
      const hash = await bcrypt.hash(newUser.password, 8);
      newUser.password = hash;
      await newUser.save();
      // flash msg as we're redirecting
      req.flash("success_msg", "You are now registered and can login");
      res.redirect("/users/login");
    } catch (error) {
      console.log(error);
    }
  }
});

// post login route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/chat",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
