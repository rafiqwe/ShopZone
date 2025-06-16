const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  product: {
    type: Array,
    default: [],
  },
  picture: String,
  gstin: String,
});

module.exports = mongoose.model("owner", userSchema);
