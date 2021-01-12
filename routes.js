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

    let [d500, d700,d1000,d1200]=[500,700,1000,1200]



    let site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d500}},

    },['name', 'site_id', 'status'])

    if (site){
       return  res.json({
            loc:`${lat}, ${long}`,
           netstatus:"EXCELLENT",
            status :0,
            message:"success",
            site

        })
    }


    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d700}},

    },['name', 'site_id', 'status']);
    if (site){
        return  res.json({
            loc:`${lat}, ${long}`,
            netstatus:"VERY GOOD",
            status :0,
            message:"success",
            site

        })
    }


    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d1000}},

    },['name', 'site_id', 'status']);
    if (site){
        return  res.json({
            loc:`${lat}, ${long}`,
            netstatus:"GOOD",
            status :0,
            message:"success",
            site

        })
    }



    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d1200}},

    },['name', 'site_id', 'status']);
    if (site){
        return  res.json({
            loc:`${lat}, ${long}`,
            netstatus:"FAIR",
            status :0,
            message:"success",
            site

        })
    }

    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $minDistance: 1300}},

    },['name', 'site_id', 'status']);
    if (site){
        return  res.json({
            loc:`${lat}, ${long}`,
            netstatus:"POOR",
            status :0,
            message:"success",
            site

        })
    }

        res.json({
            loc:`${lat}, ${long}`,
           status:1,
            message:"error",
        })






})


module.exports = router;
