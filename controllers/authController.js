const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).send("All fields are required");
    }

    //! Check if the user already exists

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "User already exists");
      return res.redirect("/users/register");
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          //! Create new user
          const user = await userModel.create({
            fullName,
            email,
            password: hash,
          });
          const token = generateToken(user);
          res.cookie("token", token);
          req.flash("success_msg", "Registered successfully!");
          res.redirect("/shop");
        }
      });
    });
  } catch (error) {
    req.flash("error_msg", "Something went wrong");
    res.redirect("/users/register");
  }
};
module.exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    req.flash("error_msg", "Email or Password is invalid");
    return res.redirect("/users/register");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = generateToken(user);
      res.cookie("token", token);
      return res.redirect("/shop");
    } else {
      req.flash("error_msg", "Email or Password is invalid");
      return res.redirect("/users/register");
    }
  });
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/users/register");
};

module.exports.registerUser = registerUser;
