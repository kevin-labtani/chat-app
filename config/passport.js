const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = function(passport) {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // find the user
      User.findOne({ email })
        .then(user => {
          if (!user) {
            // done(error, user, options)
            return done(null, false, {
              message: "That email is not registered"
            });
          }

          // match password
          bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Password incorrect"
              });
            }
          });
        })
        .catch(e => console.log(e));
    })
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
};
