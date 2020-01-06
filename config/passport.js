const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // find the user
        const user = await User.findOne({ email });
        if (!user) {
          // done(error, user, options)
          return done(null, false, {
            message: "That email is not registered"
          });
        }

        // match password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "Incorrect Password"
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

// serialize and deserialize user to support login sessions, from the doc:
// credentials used to authenticate a user will only be transmitted during the login request.
// If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.
// Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session.
// In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
