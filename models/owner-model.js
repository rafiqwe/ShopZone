const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  product: {
    type: Array,
    default: [],
  },
  picture: Buffer,
  gstin: String,
});

module.exports = mongoose.model("owner", ownerSchema);
