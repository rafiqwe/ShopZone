const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    name: String,
    email: String,
    phone: String,
    address: String,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("order", orderSchema);
