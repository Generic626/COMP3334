const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");

const Asset = require("../models/asset");
const generator = require("../methods/rand_words");
const concatHash = require("../methods/concat_hash");

router.use(bodyParser.urlencoded({ extended: true }));

router.route("/").post( (req,res)=>{
  const id = req.body.assetid;
  const output = generator(3);
  const plaintext = concatHash(output);
  const saltRounds = 10;
  //get user id
  const encryptedID = String(req.cookies.user);
  if(typeof encryptedID === 'undefined') {
    return res.redirect("/");
  }
  var bytes  = CryptoJS.AES.decrypt(encryptedID, process.env.COOKIE_KEY);
  const originalID = bytes.toString(CryptoJS.enc.Utf8);

  //check database
  Asset.findById(id, (err, result) => {
    if (err) {
	  console.log(err);
      res.redirect("/buy");
    } else {
      if(result.for_sell || result.owner != originalID) {
        var seller = result.owner;
        var price = result.price;
        var ctime = new Date().toLocaleString('en-GB');
		getHash(seller, price, ctime);
      } else {
		console.log("not for sell or same originalID");
        res.redirect("/buy");
      }
    }
  });
  //get new hash and change
  function getHash(seller, price, ctime) {
    bcrypt.hash(plaintext, saltRounds, function (err, newHash) {
      if (err) {
        return res.send(err);
      } else {
        var change = {
          asset_hash: newHash, 
          for_sell: false, 
          owner: originalID,
          $push: {
            transcations: {
              seller_id: seller,
              buyer_id: originalID,
              price: price,
              transcation_date: ctime
		    }
          }
        }
		console.log(change);
		update(change);
      };
    });
  }
  //update database
  function update(change) {
    Asset.findByIdAndUpdate(id, change, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("done");
        console.log(output[0], output[1], output[2]);
        res.render("buy-confrim", {
          word1: output[0],
          word2: output[1],
          word3: output[2],
        });
      }
    });
  }
});

module.exports = router;