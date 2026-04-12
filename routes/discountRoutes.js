// ============================================================
// routes/discountRoutes.js — Discount Banner Routes
// ============================================================
// This file defines the URL paths (endpoints) for discount
// banner image operations and connects them to controller functions.
// ============================================================

const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getAllDiscounts,
  uploadDiscount,
  updateDiscount,
  deleteDiscount,
} = require('../controllers/discountController');

// Import the upload middleware
const { uploadDiscountImage } = require('../middleware/upload');

// ── Define Routes ───────────────────────────────────────────

// GET  /api/discounts       → Get all discount banner images
router.get('/', getAllDiscounts);

// POST /api/discounts       → Upload a new discount banner
router.post('/', uploadDiscountImage, uploadDiscount);

// PUT /api/discounts/:id    → Update a discount
router.put('/:id', uploadDiscountImage, updateDiscount);

// DELETE /api/discounts/:id → Delete a discount banner by ID
router.delete('/:id', deleteDiscount);

module.exports = router;
