require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);

const userSchema = mongoose.Schema({
    name: String,
    password: String,
});

const User = mongoose.model("user",userSchema);

app.route("/").get((req,res)=>{
    User.find({}, (err, result)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log(result);
            res.write(result[0].name);
            res.write(result[0].password);
            res.send();
        }
    });

});
app.route("/login").get((req,res)=>{});

app.listen(process.env.PORT, function(){
    console.log("[3000] listening ...");
});