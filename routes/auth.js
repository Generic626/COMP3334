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
        console.log("[Log -> Error]Cannot log in");
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
        passport.authenticate("local",{ failureRedirect: '/login-error', failureMessage: true })(req, res, (err) => {
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
          // if (!resultUser) {
          //   res.render("error", {
          //     errorHeading: errorHeading,
          //     errorText: errorText,
          //     errorBtnText: errorBtnText,
          //     redirectLink: redirectLink,
          //   });
          // }
          console.log("[Login]Logged in successful");
          User.findOne({ email: email }, (err, result) => {
            if (err) {
              const errorHeading = "Something went wrong";
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
              // setup encrypted cookie
              const cipherID = CryptoJS.AES.encrypt(
                String(result._id),
                process.env.COOKIE_KEY
              ).toString();
              console.log("[Login -> Hashed ID] " + cipherID);

              // res.cookie("user", cipherID, {
              //     expires: new Date(Date.now() + 3600000),
              //     secure: true,
              //     httpOnly: true,
              // });
              res.cookie("user", cipherID);
              // render the main page
              res.redirect("/main");
            }
          });
        });
      }
    });
  });

module.exports = router;
