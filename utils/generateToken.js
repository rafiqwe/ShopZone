const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
};

// const jwt = require("jsonwebtoken");

const ownerGenerateToken = (owner) => {
  return jwt.sign({ email: owner.email, id: owner._id }, process.env.OWNER_JWT);
};

module.exports.ownerGenerateToken = ownerGenerateToken;

module.exports.generateToken = generateToken;
