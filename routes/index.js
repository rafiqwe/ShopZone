const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isOwner = require("../middlewares/isOwner");
const ownerModel = require("../models/owner-model");
const orderModel = require("../models/orders-model");

router.post("/cart/add", isLoggedIn, async (req, res) => {
  const { productId } = req.body;
  const user = await userModel.findOne({ email: req.user.email });
  user.cart.push(productId);
  await user.save();
  req.flash("success_msg", "Added to cart successfully.");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  const user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
  const cart = user.cart;

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
  req.flash("success_msg", " Cart Deleted successfully.");

  // Send back the updated cart
  res.redirect("/cart"); // or res.send(user.cart);
});

router.post("/owners/product/delete/:id", isOwner, async (req, res) => {
  try {
    // 1. Delete the product from the product model
    const productId = req.params.id;
    await productModel.findByIdAndDelete(productId);

    // 2. Find the owner
    const owner = await ownerModel.findOne(); // if only one owner

    if (owner) {
      // 3. Remove product ID from owner's product array
      owner.product = owner.product.filter(
        (prodId) => prodId.toString() !== productId
      );
      await owner.save();
    }

    req.flash("success_msg", "Product deleted successfully");
    res.redirect("/owners/products");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/checkout", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.user.email });

    // Use Promise.all to wait for all product lookups
    const cartProducts = await Promise.all(
      user.cart.map(async (cartId) => {
        const product = await productModel.findById(cartId);
        return product;
      })
    );

    res.render("checkout", { cartProducts, user }); // or res.send(cartProducts)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/checkout/place-order", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart");

    if (!user) {
      return res.status(404).send("User not found");
    }

    const { fullName, email, phone, address, total } = req.body;

    // Create and save the order
    const newOrder = await orderModel.create({
      user: { name: fullName, email, phone, address },
      products: user.cart,
      total: parseFloat(total),
    });

    // Clear the user's cart
    user.cart = [];
    await user.save();

    req.flash("success_msg", "Order placed successfully!");
    res.redirect("/shop"); // or render a page like res.render("thank-you", { order: newOrder })
  } catch (error) {
    console.error("Order failed:", error.message);
    res.status(500).send("Failed to place order");
  }
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

// Show contact form
router.get("/contact", (req, res) => {
  res.render("contact", { message: null });
});

// Handle form submission
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // You can save this to DB or send an email, etc.
  console.log("📩 Contact Form:", { name, email, message });

  res.render("contact", { message: "Thank you for contacting us!" });
});

module.exports = router;

