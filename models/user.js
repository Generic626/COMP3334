const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

// User model based on mongoDB structure
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    recovery_hash: {
        type: String,
    },
});

userSchema.plugin(passportLocalMongoose,{usernameField:'email'});

module.exports = new mongoose.model("user",userSchema);
