const express = require("express");
const axios = require("axios");
require('dotenv').config()

const router = express.Router();
const Sites = require("./models/geodata")
const CallBackMessage = require("./models/callback-request")

const validator = require("./validators");

const sendMail = require("./send_mail");

const https = require("https")
const agent = new https.Agent({
    rejectUnauthorized:false
})


router.get("/", async (req, res) => {
    res.render("index")

});

router.get("/contact-us", async (req, res) => {
    res.render("request-callback")

})
router.get("/contact-us-success", async (req, res) => {
    res.render("success-contact-us")
})

router.post("/api/message", async (req, res) => {
    const {error} = validator.validateMessage(req.body);
    console.log(error)
    if (error){
        return res.json({
            error:"error",
            message:`${error.message}`
        })

    }
    const {name, email, contact, message} = req.body

    try {
        const callBackMessage = new CallBackMessage({
            name, email, contact, message
        })
        await callBackMessage.save();
        res.json({status:"success"})
        sendMail({name, email, contact, message})
    } catch (ex) {
        console.log(ex)
        return res.json({
            error:"error",
            message:`System Error.Please try again later`
        })
    }





})
router.post("/api/network", async (req, res) => {
 try {
     let {type, ghpost, lat, long} = req.body;
     let latitude, longitude;
     if (type === "ghanapost") {
         ghpost = ghpost.toString().trim().replace(/[-\s]/g,"").toUpperCase();
         console.log(ghpost)

         const {error} = validator.validateGHPost({ghpost});
         if (error){
             return res.json({
                 error:"error",
                 message:`${error.message}`
             })

         }

         const url ="https://api.ghanapostgps.com/v2/PublicGPGPSAPI.aspx"
         axios.post(url,null, {
             auth:{
                 username:`${process.env.GPS_USER}`,
                 password:`${process.env.GPS_PASS}`
             },

             headers:{
                 DeviceID:"005056986c49"
             },
             params:{
                 Action:"GetLocation",
                 GPSName:ghpost
             },
             httpsAgent:agent
         }).then(response =>{
             if (response.data){
                 const {CenterLatitude:lat, CenterLongitude:long, Area:area} = response.data.Table[0];

                 latitude =parseFloat(lat).toFixed(7);
                 longitude =parseFloat(long).toFixed(7);
                 getSiteDetailsDistance(latitude, longitude,res, area)

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

         const {error} = validator.validateLatLong({lat, long});
         if (error){
             return res.json({
                 error:"error",
                 message:`${error.message}`
             })

         }
         latitude = parseFloat(lat);
         longitude = parseFloat(long);
         await getSiteDetailsDistance(latitude, longitude, res)

     }

 }catch (error){
     console.log(error);
     res.json({
         error:"error",
         message:`System Failure: Please contact SysAdmin`
     })

 }








})

router.post("/api/distance", async (req, res) =>{

try {
    let {latitude, longitude} = req.body;
    latitude = parseFloat(latitude);
    longitude= parseFloat(longitude);

    let site = await Sites.aggregate([{
        $geoNear: {
            near: { type: "Point", coordinates: [ longitude , latitude ] },
            distanceField: "dist.calculated",
            spherical: true
        },


    }, { $limit: 1 }]);

    const {site_id, name:site_name, status:site_status} = site[0];
    const distance = Math.round(parseFloat(site[0].dist.calculated));
    let networkCoverage;
    if (distance <= 500){
        networkCoverage="EXCELLENT";
    } else if (distance <=700){
        networkCoverage ="VERY GOOD";

    }else if (distance <= 1000){
        networkCoverage ="GOOD";

    }else if (distance <= 1200){
        networkCoverage ="FAIR";
    }else {
        networkCoverage ="POOR";

    }



    res.json({
        loc: `${latitude}, ${longitude}`,
        netstatus: networkCoverage,
        status: 0,
        message: "success",
        distance:(distance/1000).toFixed(3),
        site: {
            name:site_name,
            status:site_status,
            site_id
        }

    })


    //res.json(site)

}catch (error){
    console.log(error);
    res.json({error:0})
}





})




/*async function getSiteDetails(latitude, longitude, res, area) {
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

}*/

async function getSiteDetailsDistance(latitude, longitude, res, area) {

    try {

        latitude = parseFloat(latitude);
        longitude =parseFloat(longitude);

        let site = await Sites.aggregate([{
            $geoNear: {
                near: { type: "Point", coordinates: [ longitude , latitude ] },
                distanceField: "dist.calculated",
                spherical: true
            },


        }, { $limit: 1 }]);

        let {site_id, name:site_name, status:site_status} = site[0];
        const distance = Math.round(parseFloat(site[0].dist.calculated));
        let networkCoverage;
        if (distance <= 500){
            networkCoverage="EXCELLENT";
        } else if (distance <=700){
            networkCoverage ="VERY GOOD";

        }else if (distance <= 1000){
            networkCoverage ="GOOD";

        }else if (distance <= 1200){
            networkCoverage ="FAIR";
        } else if (distance <= 1500) {
            networkCoverage ="POOR";

        }else {
            networkCoverage ="NO COVERAGE";
            site_name="";
            site_id="";
            site_status=""
        }

        res.json({
            loc: `${latitude}, ${longitude}`,
            area,
            netstatus: networkCoverage,
            status: 0,
            message: "success",
            distance:(distance/1000).toFixed(3),
            site: {
                name:site_name,
                status:site_status,
                site_id
            }

        })

    }catch (error){
        console.log(error);
        res.json({
            error:"error",
            message:`System Failure: Please contact SysAdmin`
        })


    }




}




module.exports = router;
