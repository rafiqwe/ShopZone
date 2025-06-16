const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
router.get("/", (req, res) => {
  res.send("hey man");
});

router.post("/register", async (req, res) => {
  try {
    const fullName = "Muhammad rabbi";
    const email = "rmlamanik502@gmail.com";
    const password = "hiihello";

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          const user = await userModel.create({
            fullName,
            email,
            password: hash,
          });
          const token = generateToken(user)
          res.cookie("token", token); 
          res.send("Users Created sucssecfully");
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const userModel = require("../models/user-model");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// router.get("/", (req, res) => {
//   res.send("hey man");
// });

// router.post("/register", async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send("User already exists");
//     }

//     // Generate salt and hash password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     // Create new user
//     const user = await userModel.create({
//       fullName,
//       email,
//       password: hash,
//     });

//     // Create JWT token
//     const token = jwt.sign({ email, id: user._id }, "hahaha");

//     res.status(201).send({ token });
//   } catch (error) {
//     console.error("Registration error:", error.message);
//     res.status(500).send("Something went wrong");
//   }
// });

// module.exports = router;
