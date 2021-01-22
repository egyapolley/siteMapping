const express = require("express");
const axios = require("axios");

const router = express.Router();
const Sites = require("./models/geodata")


router.get("/", async (req, res) => {
    res.render("index")

});


router.post("/api/network", async (req, res) => {
 try {
     let {type, ghpost, lat, long} = req.body;
     let latitude, longitude;
     if (type === "ghanapost") {
         ghpost = ghpost.toString().trim().replace(/[-\s]/g,"").toUpperCase();
         console.log(ghpost)
         const url ="https://api.ghanapostgps.com/v2/PublicGPGPSAPI.aspx"
         axios.post(url,null, {
             auth:{
                 username:"005056986c49",
                 password:"U3VyZmxpbmVHSEBTdXJmbGluZSBDb21tdW5pY2F0aW9ucyBMaW1pdGVk"
             },

             headers:{
                 DeviceID:"005056986c49"
             },
             params:{
                 Action:"GetLocation",
                 GPSName:ghpost
             }
         }).then(response =>{
             if (response.data){
                 const {CenterLatitude:lat, CenterLongitude:long, Area:area} = response.data.Table[0];

                 latitude =parseFloat(lat).toFixed(7);
                 longitude =parseFloat(long).toFixed(7);
                 getSiteDetails(latitude, longitude,res, area)

             }else {
                 res.json({
                     error:"error",
                     message:`Invalid Ghana Post Code ${ghpost}`
                 })

             }





         }).catch(error =>{
             console.log(error);
             res.json({
                 error:"error",
                 message:`System Failure: Error connecting to GhanaPost Service`
             })
         })


     } else {
         latitude = parseFloat(lat);
         longitude = parseFloat(long);
         await getSiteDetails(latitude, longitude, res)

     }

 }catch (error){
     console.log(error);
     res.json({
         error:"error",
         message:`System Failure: Please contact SysAdmin`
     })

 }








})




async function getSiteDetails(latitude, longitude, res, area) {
    let [d500, d700, d1000, d1200] = [500, 700, 1000, 1200]


    let site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d500}},

    }, ['name', 'site_id', 'status'])

    if (site) {
        return res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: "EXCELLENT",
            status: 0,
            message: "success",
            site

        })
    }

    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d700}},

    }, ['name', 'site_id', 'status']);
    if (site) {
        return res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: "VERY GOOD",
            status: 0,
            message: "success",
            site

        })
    }


    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d1000}},

    }, ['name', 'site_id', 'status']);
    if (site) {
        return res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: "GOOD",
            status: 0,
            message: "success",
            site

        })
    }


    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $maxDistance: d1200}},

    }, ['name', 'site_id', 'status']);
    if (site) {
        return res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: "FAIR",
            status: 0,
            message: "success",
            site

        })
    }

    site = await Sites.findOne({
        location: {$nearSphere: {$geometry: {type: 'Point', coordinates: [longitude, latitude]}, $minDistance: 1300}},

    }, ['name', 'site_id', 'status']);
    if (site) {
        return res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: "POOR",
            status: 0,
            message: "success",
            site

        })
    }

}


module.exports = router;
