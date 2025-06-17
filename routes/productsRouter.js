const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, discount, imageUrl, category } = req.body;

    // Access the file buffer (you can upload to Cloudinary, etc.)
    const imageBuffer = req.file?.buffer;

    // If needed: Convert buffer to base64
    // const base64Image = imageBuffer.toString("base64");

    const product = await productModel.create({
      name,
      price,
      discount,
      description,
      category,
      imageUrl,
      image: imageBuffer, // or send to cloud and store the URL
    });
    req.flash("success_msg", "Product created successfully.");
    res.redirect("/owners/admin");
  } catch (err) {
    console.error(err.message);
    req.flash("error_msg", "Product created successfully.");
  }
});

module.exports = router;
