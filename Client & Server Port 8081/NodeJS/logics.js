const dal = require("./dal");
const User = require("./models/user");
const Message = require("./models/message");
const Online = require("./models/online");

function getUsers() {
    return new Promise((resolve, reject) => {
        User.find({}, (err, users) => {
            if (err) {
                reject(err);
            }
            resolve(users);
        })
    })
}

function getOnlineUsers(username) {
    return new Promise((resolve, reject) => {
        Online.find({user: username}, (err, users) => {
            if (err) {
                reject(err);
            }
            resolve(users);
        })
    })
}

function getMessages(senderID, receiverID) {
    return new Promise((resolve, reject) => {
        Message.find({ $or: [{ sender: senderID, receiver: receiverID }, { sender: receiverID, receiver: senderID }] }).populate(["sender", "receiver"]).exec((err, messages) => {
            if (err) {
                reject(err);
            }
            resolve(messages);
        });
    })
}

function isUser(userName, password) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userName, password: password }, (err, user) => {
            if (err) {
                reject(err);
            }
            resolve(user);
        })
    })
}

// get msg Sender's ID 
function getSenderID(name) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: name }, (err, user) => {
            if (err) {
                reject(err);
            }
            resolve(user);
        })
    })
}

// get msg receiver's ID 
function getReceiverID(name) {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: name }, (err, user) => {
            if (err) {
                reject(err);
            }
            resolve(user);
        })
    })
}

// add msg
function addMessage(message) {
    return new Promise((resolve, reject) => {
        const messageToAdd = new Message(message);
        messageToAdd.save((err, info) => {
            if (err) {
                reject(err);
            }
            resolve(info);
        })
    })
}

// change status login
function editUserStatus(userID, u) {
    return new Promise((resolve, reject) => {
        const userForEdit = new User(u);
        User.updateOne({ _id: userID }, userForEdit, (err, info) => {
            if (err) {
                reject(err);
            }
            console.log(info)
            resolve(info.nModified);
        })
    })
}

module.exports = {
    getUsers,
    getOnlineUsers,
    isUser,
    getMessages,
    getSenderID,
    getReceiverID,
    addMessage,
    editUserStatus
}
