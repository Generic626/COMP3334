require("dotenv").config();
const CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const User = require("../models/user");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const passport = require("passport");

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

        const user = new User({
            email: email,
            password: password,
        });
        // login the user
        req.login(user, (err) => {
            if (err) {
                console.log(err);
                console.log("Cannot log in");
                const errorHeading = "Invalid user credentials";
                const errorText = "Please try to login again";
                const errorBtnText = "Head back to login";
                const redirectLink = "/";
                res.render("error", {
                    errorHeading: errorHeading,
                    errorText: errorText,
                    errorBtnText: errorBtnText,
                    redirectLink: redirectLink,
                });
            } else {
                passport.authenticate("local")(req, res, (err) => {
                    const errorHeading = "Invalid user credentials";
                    const errorText = "Please try to login again";
                    const errorBtnText = "Head back to login";
                    const redirectLink = "/";
                    if (err) {
                        res.render("error", {
                            errorHeading: errorHeading,
                            errorText: errorText,
                            errorBtnText: errorBtnText,
                            redirectLink: redirectLink,
                        });
                    }

                    console.log("Logged in successful");
                    // setup encrypted cookie
                    const cipherID = CryptoJS.AES.encrypt(
                        String(user._id),
                        process.env.COOKIE_KEY
                    ).toString();
                    console.log("[Encrypted ID] " + cipherID);

                    res.cookie("user", cipherID, {
                        expires: new Date(Date.now() + 3600000),
                        secure: true,
                        httpOnly: true,
                    });
                    // render the main page
                    res.redirect("/main");
                });
            }
        });
    });

module.exports = router;