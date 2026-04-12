// ============================================================
// middleware/upload.js — Multer Configuration for File Uploads
// ============================================================
// Multer handles multipart/form-data (file uploads).
// We configure it to:
//   1. Save files to specific folders (products / discounts)
//   2. Only allow image files (jpg, jpeg, png, gif, webp)
//   3. Limit file size to 5MB
// ============================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── Helper: Ensure a folder exists ──────────────────────────
// Creates the folder if it doesn't already exist.
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ── File Filter: Only allow images ──────────────────────────
const imageFileFilter = (req, file, cb) => {
  // List of allowed image MIME types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    // Accept the file (Multer 2.x: pass null as error)
    cb(null, true);
  } else {
    // Reject the file — Multer 2.x accepts an Error object directly
    cb(
      new Error(
        'Only image files are allowed! (jpg, jpeg, png, gif, webp)'
      )
    );
  }
};

// ── Create an upload middleware for a specific subfolder ─────
// Usage: createUploader('products') or createUploader('discounts')
const createUploader = (subfolder) => {
  // Define storage settings
  const storage = multer.diskStorage({
    // WHERE to save the file
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', subfolder);
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },

    // WHAT to name the file
    // We add a timestamp prefix to avoid name collisions
    filename: (req, file, cb) => {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
      cb(null, uniquePrefix + extension);
    },
  });

  // Return the configured multer instance
  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
  });
};

// ── Export pre-configured uploaders ─────────────────────────
module.exports = {
  // For product images: expects a form field named "image"
  uploadProductImage: createUploader('products').single('image'),

  // For discount banners: expects a form field named "image"
  uploadDiscountImage: createUploader('discounts').single('image'),
};
