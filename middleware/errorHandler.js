// ============================================================
// middleware/errorHandler.js — Global Error Handler
// ============================================================
// This middleware catches ALL errors thrown in the app and
// returns a clean, consistent JSON response to the client.
// ============================================================

const errorHandler = (err, req, res, next) => {
  // Log the error to the server console for debugging
  console.error('❌ Error:', err.message);
  console.error('📍 Stack:', err.stack);

  // If the error is from Multer (file upload errors)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File is too large. Maximum size is 5MB.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field name in upload. Check your form field name.',
    });
  }

  // If it's a Multer error (invalid file type, etc.)
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default: send a generic 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
