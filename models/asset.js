const mongoose = require('mongoose')

// Asset model based on mongoDB structure
const assetSchema = mongoose.Schema({
    asset_name: {
        type: String,
        required: true
    },
    asset_desc: {
        type: String,
        required: true
    },
    created_date:{
        type: String,
        required: true
    },
    // asset:{
    //     type: Buffer,
    //     required: true
    // },
    asset_hash: {
        type: String,
        required: true
    },
    // author:{
    //     type: String,
    //     required: true
    // }
});

module.exports = new mongoose.model("asset",assetSchema);