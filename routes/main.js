const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const Assets = require("../models/asset");

// Main page
router
  .route("/")
  .get((req, res) => {
    if (req.isAuthenticated()) {
      console.log("Cookies is " + req.cookies.user);
      if (req.cookies.user != undefined) {
        var encryptedId = String(req.cookies.user);
        console.log("encryptedId is " + encryptedId);
        var bytes = CryptoJS.AES.decrypt(encryptedId, process.env.COOKIE_KEY);
        var originalID = bytes.toString(CryptoJS.enc.Utf8);
        console.log("originalId is " + originalID);
        Assets.find({ owner: originalID }, function (error, result) {
          if (!error) {
            var assets = result;
            res.render("main-page", { Assets: assets });
          }
        });
      } else {
        res.render("main-page", { Assets: null });
      }
    }
    else{
        res.redirect("/");
    }
  })
  .post((req, res) => {});

module.exports = router;
