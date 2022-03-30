// packages
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// models and methods
const Asset = require("../models/asset");
const generator = require("../methods/rand_words");
const concatHash = require("../methods/concat_hash");

// constant instances
const saltRounds = 10;

// create asset page
router
  .route("/")
  .get((req, res) => {
    res.render("create-asset-page");
  })
  .post((req, res) => {

    // retrieve information from request
    const assetName = req.body.assetName;
    const assetDesc = req.body.assetDesc;

    console.log(req.body);
    // getting the current date time of the creation of the asset
    const today = new Date();
    const creation_time_date = today.toLocaleString();

    // generate three random words
    const output = generator(3);

    // concat secure hash material
    const plaintext = concatHash(output);

    // bcrypt to hash the plaintext string
    bcrypt.hash(plaintext, saltRounds, function (err, assetHash) {
      // create asset document
      const asset = new Asset({
        asset_name: assetName,
        asset_desc: assetDesc,
        created_date: creation_time_date,
        asset_hash: assetHash,
      });
      // insert the newly created asset to mongoDB
      asset.save((err, asset) => {
        if (err) {
          console.log(err);
        } else {
            // render modal with three random words
        }
      });
    });
  });

module.exports = router;
