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

// ── Create an upload middleware using Memory Storage ──────────
// Memory Storage is better for Vercel and serverless environments
// because it doesn't require writing to the local disk.
const createUploader = () => {
  const storage = multer.memoryStorage();

  return multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  });
};

// ── Export pre-configured uploaders ─────────────────────────
module.exports = {
  // For product images: expects a form field named "image"
  uploadProductImage: createUploader().single('image'),

  // For discount banners: expects a form field named "image"
  uploadDiscountImage: createUploader().single('image'),
};
