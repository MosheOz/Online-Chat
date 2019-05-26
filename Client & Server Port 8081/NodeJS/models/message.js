const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    receiver: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
    // messageTitle: { type: String, require: true},
    messageBody: String,
    // date: Date
});

const Message = mongoose.model("Message", messageSchema, "messages");

module.exports = Message;