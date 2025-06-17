const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const allProducts = await productModel.find();
    // Group by category
    const manProducts = allProducts.filter((p) => p.category === "man");
    const womanProducts = allProducts.filter((p) => p.category === "woman");
    const childProducts = allProducts.filter((p) => p.category === "child");
    res.render("shop", {
      manProducts,
      womanProducts,
      childProducts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
