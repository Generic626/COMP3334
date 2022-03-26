const mongoose = require("mongoose");
const User = require('../models/user');
const express = require("express");
const router = express.Router();

const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);


// Login page
router.route("/").get( (req,res)=>{
    User.find({}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log(result);
            res.write("Login page \n");
            res.write(result[0].name);
            res.write(result[0].password);
            res.send();
        }
    });
});

module.exports = router;