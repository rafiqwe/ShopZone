const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  imageUrl: String,
  image: Buffer,
  name: String,
  price: String,
  discount: {
    type: Number,
    default: 0,
  },
  description: String,
  category: {
    type: String,
    default: "Popular",
  },
});

module.exports = mongoose.model("product", productSchema);
