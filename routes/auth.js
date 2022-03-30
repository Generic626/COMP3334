const User = require('../models/user');
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

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
    User.findOne({email:email}, (err, user)=>{
        if(err){
            console.log(err);
        }
        else{
            // if user has been found
            if(user){
                // compare the inputted password with hash stored in DB
                bcrypt.compare(password,user.password, (err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    // if the password and hash is the same
                    if(result == true){
                        console.log("logged in successful");
                        // render the main page
                        res.redirect("/main");

                        // log cookie?
                    }
                    else{
                        console.log("cannot log in");
                        alert("Logged in failed.");
                    }
                });
            }
        }
    });
});

module.exports = router;