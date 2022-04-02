const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectID;

const Asset = require("../models/asset");
const generator = require("../methods/rand_words");
const concatHash = require("../methods/concat_hash");

router.use(bodyParser.urlencoded({ extended: true }));

router.route("/:assetid").get( (req,res)=>{
	const id = req.params['assetid'];
	
    Asset.findById(id, (err, result)=>{
        if(err){
            console.log(err);
			res.redirect("/main");
        }
        else{
            if(result){
				console.log(result);
				res.render("buy-detail", {result:result, assetid:id});
            }
			else {
				console.log("no result");
				res.send("no result");
			}
        }
    });
});

module.exports = router;