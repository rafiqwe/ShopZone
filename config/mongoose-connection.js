// backend/config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // exit the app if DB fails to connect
  });

module.exports = mongoose.connection;
