const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const CryptoJS = require("crypto-js");
const Asset = require("../models/asset");

router.use(bodyParser.urlencoded({ extended: true }));
router.route("/").get((req, res) => {
    if (req.isAuthenticated()) {
        if (req.cookies.user != undefined) {
            var encryptedId = String(req.cookies.user);
            var bytes = CryptoJS.AES.decrypt(encryptedId, process.env.COOKIE_KEY);
            var originalID = bytes.toString(CryptoJS.enc.Utf8);
            console.log("originalId is " + originalID);
            Asset.find({ for_sell: true, owner: originalID }, function(error, result) {
                if (!error) {
                    console.log(result);
                    var assets = result;
                    res.render("buy", { Assets: assets });
                }
            });
        } else {
            res.render("buy", { Assets: null });
        }
    } else {
        res.redirect("/");
    }
});
router.route("/:assetid").get((req, res) => {
    if (req.params.assetid) {
        const id = req.params.assetid;
        Asset.findById(id, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect("/main");
            } else {
                if (result) {
                    console.log(result);
                    const encryptedID = String(req.cookies.user);
                    if (typeof encryptedID === 'undefined') {
                        return res.redirect("/");
                    }
                    var bytes = CryptoJS.AES.decrypt(encryptedID, process.env.COOKIE_KEY);
                    const originalID = bytes.toString(CryptoJS.enc.Utf8);
                    if (result.for_sell && result.owner !== originalID) {
                        res.render("buy-detail", { result: result, assetid: id });
                    } else {
                        res.redirect("/buy");
                    }
                } else {
                    console.log("no result");
                    res.redirect("/buy");
                }
            }
        });
    }
});

module.exports = router;