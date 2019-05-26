const express = require("express");
const router = express.Router();
const logics = require("./logics");

router.get("/users", async (request, response) => {
    try {
        const users = await logics.getUsers();
        response.json(users)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

router.get("/users-online/:username", async (request, response) => {
    const username = request.params.username;
    try {
        const users = await logics.getOnlineUsers(username);
        response.json(users)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

router.get("/get-messages/:senderID/:receiverID", async (request, response) => {
    const senederID = request.params.senderID;
    const receiverID = request.params.receiverID;
    try {
        const messages = await logics.getMessages(senederID, receiverID);
        response.json(messages)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

router.get("/user/:name/:password", async (request, response) => {
    const name = request.params.name;
    const password = request.params.password;
    try {
        const user = await logics.isUser(name, password);
        response.json(user)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

router.get("/get-sender-details/:name", async (request, response) => {

    const name = request.params.name;

    try {
        const sender = await logics.getSenderID(name);
        response.json(sender)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

router.get("/get-receiver-details/:name", async (request, response) => {

    const name = request.params.name;

    try {
        const receiver = await logics.getReceiverID(name);
        response.json(receiver)
    }
    catch (err) {
        response.status(500).json(err);
    }
});

// add msg to convs
router.post("/add-message", async (request, response) => {
    const messageToAdd = request.body;
    try {
        const messageAdded = await logics.addMessage(request.body);
        response.json(messageAdded);
    }
    catch (error) {
        response.status(500).json(error);
    }
});

//change status login to true
router.put("/user-change-status-login/:_id", async (request, response) => {
    const userID = request.params._id;
    const userBody = request.body;
    userBody._id = userID;
    try {
        const userEdited = await logics.editUserStatus(userID, userBody);
        response.json(userEdited);
    }
    catch (error) {
        response.status(500).json(error)
    }
});

module.exports = router;