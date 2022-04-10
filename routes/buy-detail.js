const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const CryptoJS = require("crypto-js");
const Asset = require("../models/asset");

router.use(bodyParser.urlencoded({ extended: true }));
router.route("/").get( (req,res)=>{
  res.send("nothing");
});
router.route("/:assetid").get( (req,res)=>{
  if(req.params.assetid) {
	const id = req.params.assetid;
    Asset.findById(id, (err, result)=>{
      if(err){
        console.log(err);
        res.redirect("/main");
      } else{
        if(result){
          console.log(result);
		  const encryptedID = String(req.cookies.user);
          if(typeof encryptedID === 'undefined') {
            return res.send("no login");
          }
          var bytes  = CryptoJS.AES.decrypt(encryptedID, process.env.COOKIE_KEY);
          const originalID = bytes.toString(CryptoJS.enc.Utf8);
		  if(result.for_sell && result.owner !== originalID) {
            res.render("buy-detail", {result:result, assetid:id});
		  } else {
			res.send("not for sale");
		  }
        } else {
          console.log("no result");
          res.send("no result");
        }
      }
    });
  }
});

module.exports = router;