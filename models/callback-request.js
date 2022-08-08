const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
    name: String,
    email:String,
    contact:String,
    message:String,
    timestamp:{
        type:Date,
        default:Date.now()
    }

});

module.exports =mongoose.model("CallBackMessage", siteSchema)
