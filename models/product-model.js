const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  image: String,
  name: String,
  price: String,
  discount: {
    type: Number,
    default: 0,
  },
  isAdmin: Boolean,
  orders: {
    type: Array,
    default: [],
  },
  bgcolor: String,
  panelolor: String,
  panelolor: String,
  textcolor: String,
});

module.exports = mongoose.model("product", productSchema);
