const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String },
  // We store the image as a Base64 string directly in the DB
  imageUrl: { type: String }, // Stores the full Base64 Data URI
  imageType: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
