const mongoose = require("mongoose");

const onlineSchema = mongoose.Schema({
    userId: String,
    user: String,
});

const Online = mongoose.model("Online", onlineSchema, "online");

module.exports = Online;