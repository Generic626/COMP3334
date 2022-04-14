const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const Assets = require("../models/asset");

// Main page
router
    .route("/")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            console.log("[Main] Cookies is " + req.cookies.user);
            if (req.cookies.user != undefined) {
                var encryptedId = String(req.cookies.user);
                console.log(" [Main] EncryptedId is " + encryptedId);
                var bytes = CryptoJS.AES.decrypt(encryptedId, process.env.COOKIE_KEY);
                var originalID = bytes.toString(CryptoJS.enc.Utf8);
                console.log("[Main] OriginalId is " + originalID);
                Assets.find({ owner: originalID }, function(error, result) {
                    if (!error) {
                        var assets = result;
                        console.log(assets);
                        res.render("main-page", { Assets: assets });
                    }
                });
            } else {
                res.render("main-page", { Assets: null });
            }
        } else {
            res.redirect("/");
        }
    })
    .post((req, res) => {});

module.exports = router;