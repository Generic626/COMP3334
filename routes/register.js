const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generator = require("../methods/rand_words");
const concatHash = require('../methods/concat_hash');
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");

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
    // should check password

    // generating password hash
    bcrypt.hash(password, saltRounds, function (err, passwordHashed) {
      if (err) {
        console.log(err);
      }
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
        }
        // user document structure
        var user = new User({
          email: email,
          password: passwordHashed,
          recovery_hash: recoveryHash,
        });
        // inserting single user document
        user.save((err, user) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Insert user completed");

            const cipherID = CryptoJS.AES.encrypt(
              String(user._id),
              process.env.COOKIE_KEY
            ).toString();
            console.log("[Encrypted ID] " + cipherID);

            res.cookie("user", cipherID, {expires: new Date(Date.now()+3600000), secure:true, httpOnly:true});
            // render after-register page
            res.render("after-register", {
              word1: output[0],
              word2: output[1],
              word3: output[2],
            });
          }
        });
      });
    });
  });

module.exports = router;
