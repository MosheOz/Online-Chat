const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: String, 
    password: String,
    login: Boolean
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;