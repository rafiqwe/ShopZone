const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
const config = require("config");

mongoose
  .connect(`${config.get("MONGODB_URL")}/shopzone`)
  .then(() => {
    debug("MongoDB connected successfully");
  })
  .catch((err) => {
    debug("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;