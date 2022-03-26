const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);


// Register page
router.route("/").get( (req,res)=>{
    res.send("Register");
});



module.exports = router;