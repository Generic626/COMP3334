require("dotenv").config();
const CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser()); 

// Login page
router
    .route("/")
    .get((req, res) => {
        // render the login page
        res.render("login", {});
    })
    .post((req, res) => {
        // retrieve information from request
        const email = req.body.email;
        const password = req.body.password;

        // check if the user account exist based on email
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                // if user has been found
                if (user) {
                    // compare the inputted password with hash stored in DB
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            console.log(err);
                            const errorHeading = "Oops! Something happened";
                            const errorText = "Please try to login again";
                            const errorBtnText = "Head back to login";
                            const redirectLink = "/";
                            res.render("error", {
                                errorHeading: errorHeading,
                                errorText: errorText,
                                errorBtnText: errorBtnText,
                                redirectLink: redirectLink
                            });
                        }
                        // if the password and hash is the same
                        if (result == true) {
                            var email = user.email;
                            var user_name = email.substring(0, email.lastIndexOf("@"));

                            console.log("Logged in successful");
                            // setup encrypted cookie
                            const cipherID = CryptoJS.AES.encrypt(
                                String(user._id),
                                process.env.COOKIE_KEY
                            ).toString();
                            console.log("[Encrypted ID] " + cipherID);

                            res.cookie("user", cipherID, {expires: new Date(Date.now()+3600000), secure:true, httpOnly:true});
                            // render the main page
                            res.redirect('main');
                        } else {
                            console.log("Cannot log in");
                            const errorHeading = "Invalid user credentials";
                            const errorText = "Please try to login again";
                            const errorBtnText = "Head back to login";
                            const redirectLink = "/";
                            res.render("error", {
                                errorHeading: errorHeading,
                                errorText: errorText,
                                errorBtnText: errorBtnText,
                                redirectLink: redirectLink
                            });
                        }
                    });
                }
            }
        });
    });

module.exports = router;