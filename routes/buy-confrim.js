const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const ObjectId = require('mongodb').ObjectID;

const Asset = require("../models/asset");
const generator = require("../methods/rand_words");
const concatHash = require("../methods/concat_hash");

router.use(bodyParser.urlencoded({ extended: true }));

router.route("/").post( (req,res)=>{
	const id = req.body.assetid;
	const output = generator(3);
    const plaintext = concatHash(output);
	const saltRounds = 10;
    bcrypt.hash(plaintext, saltRounds, function (err, newHash) {
        if (err) {
          console.log(err);
        }
        Asset.findByIdAndUpdate(id, {asset_hash: newHash}, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("done");
            res.render("buy-confrim", {
              word1: output[0],
              word2: output[1],
              word3: output[2],
            });
          }
        });
      });
});

module.exports = router;