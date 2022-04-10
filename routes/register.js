const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generator = require("../methods/rand_words");
const concatHash = require("../methods/concat_hash");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
const passport = require("passport");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

// Register page
router
  .route("/")
  .get((req, res) => {
    res.render("register", {});
  })
  .post((req, res) => {
    // retrieve information from request
    const email = req.body.email;
    const password = req.body.password;

    console.log(email);
    console.log(password);

    // generate three random words
    const output = generator(3);
    // concat secure hash material
    const plaintext = concatHash(output);
    console.log(output);
    console.log(process.env.KEY_HASH_1);
    console.log(process.env.KEY_HASH_2);
    console.log(plaintext);

    // generate secure hash
    bcrypt.hash(plaintext, saltRounds, function (err, recoveryHash) {
      if (err) {
        console.log(err);
        console.log("Recovery hash error");
        const errorHeading = "Oops! Something happened";
        const errorText =
          "Something went wrong internally, please try again later";
        const errorBtnText = "Head back to Register";
        const redirectLink = "/register";
        res.render("error", {
          errorHeading: errorHeading,
          errorText: errorText,
          errorBtnText: errorBtnText,
          redirectLink: redirectLink,
        });
      } else {
        // register the user
        User.register(
          { email: email, recovery_hash: recoveryHash },
          password,
          (err, user) => {
            if (err) {
              console.log(err);
              console.log("Register user error");
              const errorHeading = "Cannot register user";
              const errorText =
                "Cannot register user, please try again later";
              const errorBtnText = "Head back to Register";
              const redirectLink = "/register";
              res.render("error", {
                errorHeading: errorHeading,
                errorText: errorText,
                errorBtnText: errorBtnText,
                redirectLink: redirectLink,
              });
            } else {
              passport.authenticate("local")(req, res, () => {
                console.log("Insert user completed");
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
                // render after-register page
                res.render("after-register", {
                  word1: output[0],
                  word2: output[1],
                  word3: output[2],
                  redirectLink: "/main",
                  redirectLinkText: "Proceed to main",
                });
              });
            }
          }
        );
      }
    });
  });

module.exports = router;
