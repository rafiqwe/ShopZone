const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");
// console.log(dbgr);

mongoose
  .connect(`${config.get("MONGODB_URL")}/scatch`)
  .then(() => {
    console.log(dbgr("hii"));
    dbgr("mongodb connect");
  })
  .catch((err) => {
    console.log(err);

    dbgr(err);
  });

module.exports = mongoose.connection;
