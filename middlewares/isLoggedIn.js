const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");
const flash = require('connect-flash');

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "You Need to login first");
    return res.redirect('/')
  }
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    const user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
