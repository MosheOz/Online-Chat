const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Online-chat",
    { useNewUrlParser: true },
    (err, mongoClient) => {
        if (err) { 
            console.log("Error:" , err);
        }
        else{
            console.log("DB: ", mongoClient.name);
        }
    }
);