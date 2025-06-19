// const express = require("express");
// const router = express.Router();
// const upload = require("../middlewares/upload");
// const productModel = require("../models/product-model");
// const ownerModel = require("../models/owner-model");

// router.post("/create", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, description, discount, imageUrl, category } = req.body;

//     // Access the file buffer (you can upload to Cloudinary, etc.)
//     const imageBuffer = req.file?.buffer;

//     // If needed: Convert buffer to base64
//     // const base64Image = imageBuffer.toString("base64");
//     const owner = await ownerModel.find();
//     if (!owner) {
//       return res.status(404).send("Owner not found");
//     }

//     const product = await productModel.create({
//       name,
//       price,
//       discount,
//       description,
//       category,
//       imageUrl,
//       image: imageBuffer, // or send to cloud and store the URL
//     });
//     owner.product.push(product._id); // ✅ Now 'owner' is defined
//     await owner.save();
//     req.flash("success_msg", "Product created successfully.");
//     res.redirect("/owners/admin");
//   } catch (err) {
//     console.error(err.message);
//     req.flash("error_msg", "Product created successfully.");
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const productModel = require("../models/product-model");
const ownerModel = require("../models/owner-model");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, discount, imageUrl, category } = req.body;

    const imageBuffer = req.file?.buffer;

    const owners = await ownerModel.find();
    if (!owners || owners.length === 0) {
      return res.status(404).send("Owner not found");
    }

    const owner = owners[0]; // ✅ get the first (and only) owner

    const product = await productModel.create({
      name,
      price,
      discount,
      description,
      category,
      imageUrl,
      image: imageBuffer,
    });

    owner.product.push(product._id); // ✅ Now works
    await owner.save();

    req.flash("success_msg", "Product created successfully.");
    res.redirect("/owners/admin");
  } catch (err) {
    console.error(err.message);
    req.flash("error_msg", "Something went wrong.");
    res.redirect("/owners/admin");
  }
});

module.exports = router;
