const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error_msg", "Please log in to access this page");
    return res.redirect("/user"); // Redirect to login/register page
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hahaha");
    req.user = decoded; // Store user data in request object
    next(); // Allow access to next middleware or route
  } catch (err) {
    req.flash("error_msg", "Session expired, please login again");
    return res.redirect("/auth");
  }
};

module.exports = isLoggedIn;
