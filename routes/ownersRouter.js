const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const isLoggedIn = require("../middlewares/isLoggedIn")

if (process.env.NODE_ENV === "development") {
  router.post("/create", async (req, res) => {
    const ownser = await ownerModel.find();
    if (ownser.length > 0) {
      return res
        .status(503)
        .send("You don't have permission to create a new owner");
    }
    const { fullName, email, password } = req.body;
    const createOwner = await ownerModel.create({
      fullName,
      email,
      password,
    });
    res.send(createOwner);
  });
}
router.get("/admin",isLoggedIn, (req, res) => {
  res.render("admin");
});

module.exports = router;
