const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
const Assets = require('../models/asset');
const concatHash = require('../methods/concat_hash');

router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').post((req, res) => {
    var assetId = req.body.assetid;
    var price = req.body.price;
    console.log("assetId" + assetId);
    var words = [];
    words.push(req.body.fword);
    words.push(req.body.sword);
    words.push(req.body.tword);
    var price = req.body.price;
    var getAsset = Assets.findById(assetId, function(err, result) {
        if (!err) {
            const plaintext = concatHash(words);
            console.log(result);
            bcrypt.compare(plaintext, result.asset_hash, function(err, result) {
                if (!result) {
                    const errorHeading = "Incorrect Strings";
                    const errorText = "Please try to re-enter again";
                    const errorBtnText = "Head back to Main Page";
                    const redirectLink = "/main";
                    res.render("error", {
                        errorHeading: errorHeading,
                        errorText: errorText,
                        errorBtnText: errorBtnText,
                        redirectLink: redirectLink
                    });
                } else if (result) {
                    console.log("Success");
                    Assets.findOneAndUpdate({ '_id': assetId }, { 'price': price, 'for_sell': true }, { returnNewDocument: true }, function(error, re) {
                        console.log(re);
                    });
                    //Render main-page
                    res.redirect('main');
                }
            });
        }
    });


});
module.exports = router;