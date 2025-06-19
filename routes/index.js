const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwner = require("../middlewares/isOwner");

router.post("/cart/add", isLoggedIn, async (req, res) => {
  const { productId } = req.body;
  const user = await userModel.findOne({ email: req.user.email });
  user.cart.push(productId);
  await user.save();
  req.flash("success_msg", "Add to Cart successfully.");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  const cart = user.cart;
  const total = cart.forEach((item) => {
    console.log();
  });

  res.render("cart", { cart });
});

router.post("/cart/remove", isLoggedIn, async (req, res) => {
  const { productId } = req.body;

  // Find the user
  const user = await userModel.findOne({ email: req.user.email });

  // Filter out the product you want to remove
  user.cart = user.cart.filter((item) => item._id.toString() !== productId);

  // Save the updated user
  await user.save();

  // Send back the updated cart
  res.redirect("/cart"); // or res.send(user.cart);
});

router.get("/shop", isLoggedIn, async (req, res) => {
  try {
    const sort = req.query.sort; // "low" or "high"
    let sortOption = {};

    if (sort === "low") {
      sortOption = { price: 1 }; // Ascending
    } else if (sort === "high") {
      sortOption = { price: -1 }; // Descending
    }

    // Get all products with optional sorting
    const allProducts = await productModel.find().sort(sortOption);

    // Group by category
    const manProducts = allProducts.filter((p) => p.category === "man");
    const womanProducts = allProducts.filter((p) => p.category === "woman");
    const childProducts = allProducts.filter((p) => p.category === "child");

    res.render("shop", {
      manProducts,
      womanProducts,
      childProducts,
      sort,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
