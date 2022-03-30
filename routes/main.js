const express = require("express");
const router = express.Router();

// Main page
router.route("/").get((req,res)=>{
    res.render("main-page");
}).post((req,res)=>{});


module.exports = router;