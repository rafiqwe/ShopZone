const mongoose = require('express');
const { model } = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/Scatch");

const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    product: {
        type: Array,
        default:[]
    },
    picture: String,
    gstin: String,
});


module.exports = mongoose.model("user", userSchema);