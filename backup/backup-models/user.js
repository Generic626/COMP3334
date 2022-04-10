const mongoose = require('mongoose')


// User model based on mongoDB structure
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    recovery_hash: {
        type: String,
        required: true
    },
});

module.exports = new mongoose.model("user",userSchema);
