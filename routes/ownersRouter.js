const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const isOwner = require("../middlewares/isOwner");
const isLoggedIn = require("../middlewares/isLoggedIn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ownerGenerateToken } = require("../utils/generateToken");
const ordersModel = require("../models/orders-model");
const productModel = require("../models/product-model");
const upload = require("../middlewares/upload");

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    try {
      // Check if any owner already exist

      const existingOwner = await ownerModel.find();
      if (existingOwner.length > 0) {
        return res.send("Owner already exists. Creation Not Allowed.");
      }

      const { email, password, fullName } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).send("All fields are required.");
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newOwner = await ownerModel.create({
        fullName,
        email,
        password: hashedPassword,
      });

      const ownerToken = ownerGenerateToken(newOwner);

      // Set token in cookie
      res.cookie("ownerToken", ownerToken);
      // res.redirect("/owners/admin");

      res.status(201).send({
        ownerToken: ownerToken,
        message: "Owner created successfully",
        owner: {
          id: newOwner._id,
          email: newOwner.email,
        },
      });
    } catch (err) {
      console.error("Owner creation failed:", err.message);
      res.status(500).send("Server Error");
    }
  });
}

router.get("/login", (req, res) => {
  res.render("owner");
});

router.get("/product/edit/:id", async (req, res) => {
  const { id } = req.params;
  const product = await productModel.findById(id);
  res.render("editProduct", { product });
});

router.post("/product/edit/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, price, category, discount, imageUrl, description } = req.body;

  try {
    const updatedData = {
      name,
      price,
      category,
      discount,
      imageUrl,
      description,
    };

    if (req.file) {
      updatedData.image = "/uploads/" + req.file.filename;
    }

    const product = await productModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!product) {
      // Option 1: Render directly
      return res.redirect("/owners/products");
    }

    // Option 2: Flash message + redirect
    req.session.success_msg = "Product updated successfully!";
    res.redirect("/owners/products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.render("owners/product", {
      error_msg: "Something went wrong while updating the product.",
      product: {},
    });
  }
});

router.get("/logout", (req, res) => {
  res.cookie("ownerToken", "");
  res.redirect("/owners/login");
});

router.post("/login/dash", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find owner by email
    const owner = await ownerModel.findOne({ email });
    if (!owner) {
      // res.send("owner not fount");
      req.flash("error_msg", "Owner not found");
      return res.redirect("/owners/login");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      // res.send("passwod incorrect");
      req.flash("error_msg", "Incorrect password");
      return res.redirect("/owners/login");
    }

    // Generate token
    const ownerToken = ownerGenerateToken(owner);

    // Set token in cookie
    res.cookie("ownerToken", ownerToken);
    res.redirect("/owners/admin");
  } catch (err) {
    console.error("Login error:", err.message);
    req.flash("error", "Login failed");
    res.redirect("/owners/login");
  }
});

router.get("/admin", isOwner, isLoggedIn, (req, res) => {
  res.render("admin");
});

router.get("/products", isOwner, async (req, res) => {
  try {
    const owner = await ownerModel
      .findOne({ email: req.owner.email })
      .populate("product"); // ✅ populate product instead of cart

    if (!owner) {
      return res.status(404).send("Owner not found");
    }
    res.render("all-product", { products: owner.product }); // render to a view
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/oders", isOwner, isLoggedIn, async (req, res) => {
  const orders = await ordersModel.find().populate("products");
  console.log(orders);

  res.render("orders", { orders });
});

module.exports = router;
