const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose-connection");
const app = express();
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const expressSeccion = require("express-session");
const flash = require("connect-flash");
const index = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSeccion({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
  })
);
app.use(flash());

//* Make flash messages available in all EJS views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
require("dotenv").config();

const port = 3000;

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/", index);
app.listen(port);
