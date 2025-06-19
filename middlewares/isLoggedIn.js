const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.flash("error_msg", "Please log in to access this page");
    return res.redirect("/users"); // Redirect to login/register page
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Store user data in request object
    next(); // Allow access to next middleware or route
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Session expired, please login again");
    return res.redirect("/users");
  }
};

module.exports = isLoggedIn;
