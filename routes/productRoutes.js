// ============================================================
// routes/productRoutes.js — Product Image Routes
// ============================================================
// This file defines the URL paths (endpoints) for product
// image operations and connects them to controller functions.
// ============================================================

const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getAllProducts,
  uploadProduct,
  deleteProduct,
} = require('../controllers/productController');

// Import the upload middleware
const { uploadProductImage } = require('../middleware/upload');

// ── Define Routes ───────────────────────────────────────────

// GET  /api/products       → Get all product images
router.get('/', getAllProducts);

// POST /api/products       → Upload a new product image
// The uploadProductImage middleware runs FIRST to handle the file,
// then the uploadProduct controller saves the data.
router.post('/', uploadProductImage, uploadProduct);

// DELETE /api/products/:id → Delete a product image by ID
router.delete('/:id', deleteProduct);

module.exports = router;
