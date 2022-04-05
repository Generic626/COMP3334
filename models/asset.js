const mongoose = require("mongoose");

// Asset model based on mongoDB structure
const assetSchema = mongoose.Schema({
  asset_name: {
    type: String,
    required: true,
  },
  asset_desc: {
    type: String,
    required: true,
  },
  created_date: {
    type: String,
    required: true,
  },
  asset: {
    type: String,
    required: true,
  },
  asset_hash: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  for_sell: {
    type: Boolean,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  transcations: [{ seller_id: String, buyer_id: String, price: Number, transcation_date: String}],
});

module.exports = new mongoose.model("asset", assetSchema);
