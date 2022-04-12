const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Assets = require('../models/asset');

router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').post((req, res) => {
    var assetId = req.body.assetid;
    console.log(assetId);
    Assets.findOneAndUpdate({ _id: assetId }, { price: 0, for_sell: false }, function(err, result) {
        if (err) {
            const errorHeading = "Error occurs when cancelling";
            const errorText = "Please try to re-enter again";
            const errorBtnText = "Head back to Main Page";
            const redirectLink = "/main";
            res.render("error", {
                errorHeading: errorHeading,
                errorText: errorText,
                errorBtnText: errorBtnText,
                redirectLink: redirectLink
            });
        } else {
            res.redirect('/main');
        }
    });

});


module.exports = router;