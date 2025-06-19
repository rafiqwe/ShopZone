const jwt = require("jsonwebtoken");

const isOwner = (req, res, next) => {
  const ownerToken = req.cookies.ownerToken;

  if (!ownerToken) {
    req.flash("error_msg", "Unauthorized. Please log in.");
    return res.redirect("/owners/login"); // Redirect to owners/login page
  }

  try {
    const decoded = jwt.verify(ownerToken, process.env.OWNER_JWT);
    req.user = decoded; // Store user data in request object
    next(); // Allow access to next middleware or route
  } catch (err) {
    console.log(err);
    req.flash("error_msg", "Session expired, please login again");
    return res.redirect("/users");
  }
};

module.exports = isOwner;

// const Owner = require("../models/owner-model");

// const isOwner = async (req, res, next) => {
//   try {
//     // Step 1: Check if user is logged in
//     if (!req.user) {
//       return res.status(401).send("Unauthorized. Please log in.");
//     }

//     // Step 2: Find owner by email from logged in user
//     const owner = await Owner.findOne({ email: req.user.email });

//     // Step 3: If not found, block access
//     if (!owner) {
//       return res.status(403).send("Access Denied. Only Owner can access this page.");
//     }

//     // Step 4: Owner found, move to next step
//     next();
//   } catch (err) {
//     console.error("isOwner middleware error:", err.message);
//     res.status(500).send("Server error");
//   }
// };

// module.exports = isOwner;
