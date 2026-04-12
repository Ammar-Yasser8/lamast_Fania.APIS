const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ GET Products Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPLOAD A PRODUCT IMAGE
const uploadProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided.',
      });
    }

    // Read the file and convert to Base64
    const imagePath = req.file.path;
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    const newProduct = new Product({
      name: req.body.name || '',
      description: req.body.description || '',
      price: req.body.price || '',
      imageUrl: dataUri, // Store the full data URI
      imageType: req.file.mimetype,
    });

    await newProduct.save();

    // Clean up: Delete the local file after saving to DB
    fs.unlinkSync(imagePath);

    res.status(201).json({
      success: true,
      message: 'Product saved to Database!',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE A PRODUCT IMAGE
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted from Database!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  uploadProduct,
  deleteProduct,
};
