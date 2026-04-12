const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, 
  imageType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Discount', discountSchema);
