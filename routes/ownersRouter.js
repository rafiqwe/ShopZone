const express = require("express");
const router = express.Router();

console.log(process.env.NODE.ENV);

router.get("/", (req, res) => {
  res.send("hey man");
});

module.exports = router;
