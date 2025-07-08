const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
const app = express();
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const expressSession = require("express-session");
const flash = require("connect-flash");
const index = require("./routes/index");
const serverless = require("serverless-http");
require("dotenv").config();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
  })
);
app.use(flash());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Global flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Routes
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/", index);

// Export for serverless
module.exports = app;
module.exports.handler = serverless(app);
