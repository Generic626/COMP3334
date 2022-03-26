const mongoose = require('mongoose')


// User model based on mongoDB structure
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = new mongoose.model("user",userSchema);
