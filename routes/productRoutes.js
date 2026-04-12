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
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Import the upload middleware
const { uploadProductImage } = require('../middleware/upload');

// ── Define Routes ───────────────────────────────────────────

// GET  /api/products       → Get all product images
router.get('/', getAllProducts);

// POST /api/products       → Upload a new product image
router.post('/', uploadProductImage, uploadProduct);

// PUT /api/products/:id    → Update a product
router.put('/:id', uploadProductImage, updateProduct);

// DELETE /api/products/:id → Delete a product image by ID
router.delete('/:id', deleteProduct);

module.exports = router;
