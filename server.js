// ============================================================
// server.js — Main entry point for the Lamasat Fanyaa Backend
// ============================================================
// This file sets up Express, applies middleware, registers
// routes, and starts the server.
// ============================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Import route files
const productRoutes = require('./routes/productRoutes');
const discountRoutes = require('./routes/discountRoutes');
const couponRoutes = require('./routes/couponRoutes');

// Import the global error handler
const errorHandler = require('./middleware/errorHandler');

// ── Create the Express app ──────────────────────────────────
const app = express();

// ── Define the port ─────────────────────────────────────────
// Uses the PORT environment variable if available, otherwise 5001
const PORT = process.env.PORT || 5001;

// ── Connect to MongoDB ──────────────────────────────────────
const options = {
  serverSelectionTimeoutMS: 60000, // Wait 60 seconds
  connectTimeoutMS: 60000,
  tls: true,
  tlsAllowInvalidCertificates: true, // Sometimes helps with network proxies
};

mongoose.connect(process.env.MONGO_URI, options)
  .then(() => console.log('🚀 Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ============================================================
//  MIDDLEWARE
// ============================================================

// Enable CORS so the React frontend (running on a different port)
// can communicate with this backend.
app.cors = cors({
  origin: '*', // Allow all origins (restrict in production)
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
});
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets.
// Example: GET http://localhost:5000/uploads/products/image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
//  ROUTES
// ============================================================

// Health-check route — useful to verify the server is running
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Lamasat Fanyaa API is running!',
    endpoints: {
      products: '/api/products',
      discounts: '/api/discounts',
      coupons: '/api/coupons',
    },
  });
});

// Mount the product routes at /api/products
app.use('/api/products', productRoutes);

// Mount the discount routes at /api/discounts
app.use('/api/discounts', discountRoutes);

// Mount the coupon routes at /api/coupons
app.use('/api/coupons', couponRoutes);

// ============================================================
//  ERROR HANDLING
// ============================================================

// Global error handler — catches any error thrown in routes
app.use(errorHandler);

// ============================================================
//  START THE SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(`\n✅  Server is running on http://localhost:${PORT}`);
  console.log(`📁  Uploads served at  http://localhost:${PORT}/uploads`);
  console.log(`📦  Products API       http://localhost:${PORT}/api/products`);
  console.log(`🏷️   Discounts API      http://localhost:${PORT}/api/discounts`);
  console.log(`🎟️   Coupons API        http://localhost:${PORT}/api/coupons\n`);
});

module.exports = app;
