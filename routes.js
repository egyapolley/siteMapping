const express = require("express");

const router = express.Router();
const Sites = require("./models/geodata")


router.get("/", async (req, res) => {
    res.render("index")

});


router.post("/api/network", async (req, res) => {
    console.log(req.body)
    const {type, ghpost, lat, long} = req.body;
    let latitude, longitude;
    if (type === "ghanapost") {
        console.log(ghpost)

    } else {
        latitude = lat;
        longitude = long;
    }


    latitude = parseFloat(latitude);
    longitude = parseFloat(longitude);

    let site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: 1000}},

    },['name', 'site_id', 'status'])

    if (site){
        res.json({
            loc:`${lat}, ${long}`,
            status :0,
            message:"success",
            site

        })
    }else {
        res.json({
            loc:`${lat}, ${long}`,
           status:1,
            message:"error",
        })
    }





})


module.exports = router;
