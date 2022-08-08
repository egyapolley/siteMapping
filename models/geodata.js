const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
    name: String,
    status:String,
    site_id:String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

module.exports =mongoose.model("Sites", siteSchema)
