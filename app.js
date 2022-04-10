// pacakges
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require("./models/user");

// routes
const auth = require('./routes/auth');
const register = require('./routes/register');
const main = require('./routes/main');
const create_asset = require('./routes/create-asset');
const buy_asset = require('./routes/buy-detail');
const buy_confirm = require('./routes/buy-confrim');
const logout = require('./routes/logout');
const sell = require('./routes/sell');
const forget_password = require('./routes/forget-password');

// middleware setup
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_KEY,
    saveUninitialized:false,
    resave:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// connecting to mongoDB Atlas
const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);

// setting up routers
app.use('/', auth);
app.use('/register', register);
app.use('/main', main);
app.use('/create-asset', create_asset);
app.use('/buy', buy_asset);
app.use('/buy/confirm', buy_confirm);
app.use('/logout', logout);
app.use('/sell', sell);
app.use('/forget-password', forget_password)

app.listen(process.env.PORT, function() {
    console.log("listening to port " + process.env.PORT);
});