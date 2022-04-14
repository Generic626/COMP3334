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
const checker = require("../methods/password_check");

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
    const reEneteredPassword = req.body.reEnteredPassword;

    if (String(password) == String(reEneteredPassword)) {
      console.log("[Register Email] "+email);
      console.log("[Register Password] "+password);
      // validate password using the checker method
      if (checker(password) != null) {
        // generate three random words
        const output = generator(3);
        // concat secure hash material
        const plaintext = concatHash(output);
        console.log("[Regsiter]"+output);
        console.log("[Regsiter]"+process.env.KEY_HASH_1);
        console.log("[Regsiter]"+process.env.KEY_HASH_2);
        console.log("[Regsiter]"+plaintext);

        // generate secure hash
        bcrypt.hash(plaintext, saltRounds, function (err, recoveryHash) {
          if (err) {
            console.log(err);
            console.log("[Regsiter] Recovery hash error");
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
                  console.log("[Regsiter] Register user error");
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
                        console.log("[Regsiter Encrypted ID] " + cipherID);

                        // res.cookie("user", cipherID, {
                        //     expires: new Date(Date.now() + 3600000),
                        //     secure: true,
                        //     httpOnly: true,
                        // });
                        res.cookie("user", cipherID);
                        // render after-register page
                        res.render("after-register", {
                          word1: output[0],
                          word2: output[1],
                          word3: output[2],
                          redirectLink: "/main",
                          redirectLinkText: "Proceed to main",
                        });
                      }
                    });
                  });
                }
              }
            );
          }
        });
      } else {
        const errorHeading = "Password does not match the requirement";
        const errorText = "Please make sure that you include at least 1 upper and lower case letter, 1 number and [@$!%*#?&] 1 of these characters.";
        const errorBtnText = "Head back to register";
        const redirectLink = "/register";
        res.render("error", {
          errorHeading: errorHeading,
          errorText: errorText,
          errorBtnText: errorBtnText,
          redirectLink: redirectLink,
        });
      }
    } else {
      const errorHeading = "Passwords are not identical";
      const errorText = "Please make sure that you enter the right password";
      const errorBtnText = "Head back to register";
      const redirectLink = "/register";
      res.render("error", {
        errorHeading: errorHeading,
        errorText: errorText,
        errorBtnText: errorBtnText,
        redirectLink: redirectLink,
      });
    }
  });

module.exports = router;
