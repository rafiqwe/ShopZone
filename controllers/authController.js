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
      return res.status(400).send("User already exists");
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
          res.send("Users Created sucssecfully");
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.loginUser = async function (req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) res.status(400).send("Email or Password invaild");

  bcrypt.compare(password, user.password, (err, result) => {
    if(result) {
      const token = generateToken(user);      
      res.cookie('token', token);
      res.send('You can Login');
    }
    else res.status(400).send("Email or Password invaild");
  });
};

module.exports.registerUser = registerUser;
