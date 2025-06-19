const jwt = require("jsonwebtoken");

const isOwner = (req, res, next) => {
  const ownerToken = req.cookies.ownerToken;

  if (!ownerToken) {
    req.flash("error_msg", "Unauthorized. Please log in.");
    return res.redirect("/owners/login"); // Redirect to owners/login page
  }

  try {
    const decoded = jwt.verify(ownerToken, process.env.OWNER_JWT);
    req.owner = decoded; // Store user data in request object
    next(); // Allow access to next middleware or route
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Session expired, please login again");
    return res.redirect("/users");
  }
};

module.exports = isOwner;
