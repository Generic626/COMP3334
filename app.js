// pacakges
require("dotenv").config(); 
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// routes
const auth = require('./routes/auth');
const register = require('./routes/register');
const main = require('./routes/main');
const create_asset = require('./routes/create-asset');
const buy_asset = require('./routes/buy-detail');
const buy_confirm = require('./routes/buy-confrim');
const logout = require('./routes/logout');

// connecting to mongoDB Atlas
const connection_string = process.env.DB_CONNECTION;
mongoose.connect(connection_string);


// middleware setup
app.set('view engine', 'ejs');
app.use(express.static("public"));


// setting up routers
app.use('/', auth);
app.use('/register', register);
app.use('/main', main);
app.use('/create-asset', create_asset);
app.use('/buy', buy_asset);
app.use('/buy/confirm', buy_confirm);
app.use('/logout', logout);

app.listen(process.env.PORT, function(){
    console.log("listening to port "+ process.env.PORT);
});