const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const db = require("./config/mongoose-connection");
const app = express();
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productRouter = require("./routes/productsRouter");
const expressSeccion = require("express-session");
const flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSeccion({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  })
);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));
require("dotenv").config();

const port = 3000;

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.listen(port);
