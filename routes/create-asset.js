// packages
require("dotenv").config();
const CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

// models and methods
const Asset = require("../models/asset");
const generator = require("../methods/rand_words");
const checker = require("../methods/tag_check");
const concatHash = require("../methods/concat_hash");

// constant instances
const saltRounds = 10;

// defining storage to store images
const storage = multer.diskStorage({
    //destination for files
    destination: function(req, file, callback) {
        callback(null, "./public/uploads/images");
    },

    //add back the extension
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

// the upload object for uploding the image
const upload = multer({
    storage: storage,
});

// create asset page
router
    .route("/")
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render("create-asset-page", {
                isDisplayed: false,
                word1: "Do-Not-Use",
                word2: "Do-Not-Use",
                word3: "Do-Not-Use",
            });
        }
        else{
            res.redirect("/");
        }
        
    })
    .post(upload.single("assetImage"), (req, res) => {
        // retrieve information from request
        const assetName = checker(String(req.body.assetName));
        console.log(assetName);
        const assetDesc = checker(String(req.body.assetDesc));
        const assetImage = req.file.filename;

        // retrieve user id from cookie
        const encryptedID = String(req.cookies.user);
        console.log("[Create Asset -> Encrypted ID] " + encryptedID);
        var bytes = CryptoJS.AES.decrypt(encryptedID, process.env.COOKIE_KEY);
        var originalID = bytes.toString(CryptoJS.enc.Utf8);
        console.log("[Create Asset -> Decrypted ID] " + originalID);

        // getting the current date time of the creation of the asset
        const today = new Date();
        const creation_time_date = today.toLocaleString();

        // generate three random words
        const output = generator(3);

        // concat secure hash material
        const plaintext = concatHash(output);

        console.log("[Create Asset -> Plaintext] Before-create Plaintext: " + plaintext);

        // bcrypt to hash the plaintext string
        bcrypt.hash(plaintext, saltRounds, function(err, assetHash) {
            console.log("[Create Asset -> Asset Hash]" + assetHash);
            // create asset document
            const asset = new Asset({
                asset_name: assetName,
                asset_desc: assetDesc,
                asset: assetImage,
                created_date: creation_time_date,
                asset_hash: assetHash,
                author: originalID,
                owner: originalID,
                for_sell: false,
                price: 0,
                transcations: [],
            });
            // insert the newly created asset to mongoDB
            asset.save((err, asset) => {
                if (err) {
                    console.log(err);
                    const errorHeading = "Oops! Something happened";
                    const errorText = "Please try to create asset again";
                    const errorBtnText = "Head back to create asset";
                    const redirectLink = "/create-asset";
                    res.render("error", {
                        errorHeading: errorHeading,
                        errorText: errorText,
                        errorBtnText: errorBtnText,
                        redirectLink: redirectLink,
                    });
                } else {
                    // render modal with three random words
                    res.render("create-asset-page", {
                        isDisplayed: true,
                        word1: output[0],
                        word2: output[1],
                        word3: output[2],
                    });
                }
            });
        });
    });

module.exports = router;