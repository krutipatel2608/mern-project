const res = require("express/lib/response");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/youtubeRegistration")
.then( () => {
    console.log("connection successfull..");
})
.catch( (err) => {
    console.log("connection fail..");
});