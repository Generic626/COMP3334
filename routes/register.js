const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const generator = require("../methods/rand_words");

const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);

router.use(bodyParser.urlencoded({ extended: true }));

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

    // generating password hash
    bcrypt.hash(password, saltRounds, function (err, passwordHashed) {
      if (err) {
        console.log(err);
      }
      // generate three random words
      const output = generator(3);
      // concat secure hash material
      const plaintext =
        output[0] +
        process.env.KEY_HASH_1 +
        output[1] +
        process.env.KEY_HASH_2 +
        output[2];

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
