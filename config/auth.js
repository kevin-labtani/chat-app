// auth middleware to protect pages by checking for auth users
// isAuthenticated provided by passport

module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash("error_msg", "Please login to view this resource");
    res.redirect("/users/login");
  }
};
