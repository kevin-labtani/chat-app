const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

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
    // validation passed
    User.findOne({ email }).then(user => {
      if (user) {
        // user already exists
        errors.push({ msg: "Email already registered" });

        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // instantiate new user and save them to db
        const newUser = new User({
          name,
          email,
          password
        });

        // hash password
        bcrypt.hash(newUser.password, 8, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // save user
          newUser
            .save()
            .then(user => {
              // flash msg as we're redirecting
              req.flash("success_msg", "You are now registered and can login");
              res.redirect("/users/login");
            })
            .catch(e => console.log(e));
        });
      }
    });
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
