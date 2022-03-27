const mongoose = require("mongoose");
const User = require('../models/user');
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);

router.use(bodyParser.urlencoded({ extended: true }));

// Login page
router.route("/").get( (req,res)=>{
    // render the login page
    res.render("login",{});
}).post((req, res)=>{
    // retrieve information from request
    const email = req.body.email;
    const password = req.body.password;

    // check if the user account exist based on email
    User.findOne({email:email}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            // if user has been found
            if(result){
                // compare the inputted password with hash stored in DB
                bcrypt.compare(password,result.password, (err,res)=>{
                    if(err){
                        console.log(err);
                    }
                    // if the password and hash is the same
                    if(res == true){
                        console.log("logged in successful");
                        // render the main page
                    }
                });
            }
        }
    });
});

module.exports = router;