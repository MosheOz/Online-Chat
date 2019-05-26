var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const bodyParser = require('body-parser');
const controller = require("./controller");
const cors = require("cors");
const Online = require("./models/online");
const User = require("./models/user");
const socketForPort8080 = require('socket.io-client')('http://localhost:8080');

// enable client-server on 2 different ports
app.use(cors());

// parse application/json
app.use(bodyParser.json())

// redirect all /api calls through the controller
app.use("/api", controller);

// socket io ---
io.on('connection', socket => {

    // get the user ID
    const socketId = socket.id;

    // on 'login' event do this: 
    socket.on('login', socket => {
        const o = {
            userId: socketId,
            user: socket
        };

        // add current user to online collection
        const onlineToAdd = new Online(o);
        onlineToAdd.save(function (err, data) {
            if (err) console.log(err);
        });

        // change the user statment login to be on true
        User.updateOne({ userName: socket }, { login: true }, (err, info) => {
            if (err) console.log(err);
            console.log(info);
        })

        // send back event to listernes that user loged in
        io.emit('login', socket);
        io.emit("loginOn8081", socket);
    });

    // get online users
    socket.on('findHwoIsOnline', () => {
        Online.find({}, (err, data) => {
            if (err) console.log(err);
            io.emit("findHwoIsOnline", data);
        })
    })

    // do this things on user disconnect and emit
    socket.on('disconnect', () => {
        // delete user from online collection
        Online.deleteOne({ userId: socketId }).remove().exec();
        // find current user in online collection
        Online.findOne({ userId: socketId }, (err, data) => {
            if (err) console.log(err);

            //change login statment for this user
            if (data !== null) {
                const username = data.user;
                User.updateOne({ userName: username }, { login: false }, (err, info) => {

                    if (err) console.log(err);
                    io.emit("disconnect", username);
                    io.emit("disconnectOn8081", username);
                })
                console.log(username + "disconnected")
            }

        })
    });

    // when message event
    socket.on("message", msg => {

        // get receiver name
        const username = msg.receiver.userName;

        // find it on online users 
        Online.findOne({ user: username }, (err, data) => {
            if (err) console.log(err);

            if (data !== null) {
                io.emit("message", msg);
                io.emit("messagefrom8081", msg);
            }

        })

    })

});

// get other login user on another platform/port
socketForPort8080.on('loginOn8080', socket => {

    // check if server emit it already to prevent re-sending
    if (!socket.sentMydata) {
        io.emit('login', socket);
        socket.sentMydata = true;
        return;
    }

});

// get messages of other users on another platform/port
socketForPort8080.on('messagefrom8080', socket => {

    // check if server emit it already to prevent re-sending
    if (!socket.sentMydata) {
        io.emit('message', socket);
        socket.sentMydata = true;
        return;
    }

});

// get other logout user on another platform/port
socketForPort8080.on('disconnectOn8080', socket => {

    // check if server emit it already to prevent re-sending
    if (!socket.sentMydata) {
        io.emit('disconnect', socket);
        socket.sentMydata = true;
        return;
    }

});

// open connection on port 8081
http.listen(8081, function () {
    console.log('listening on *:8081');
});