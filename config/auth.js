// auth middleware to protect pages by checking for auth users
// isAuthenticated is a flag provided by passport

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "You need to login to access this page");
    res.redirect("/users/login");
  }
};
