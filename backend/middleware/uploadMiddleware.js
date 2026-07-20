const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// ─── Configure Cloudinary ─────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Cloudinary Storage Engine ────────────────────────────────────────────────
// Files are uploaded directly to Cloudinary — never touch the local disk.
// req.file.path  → full HTTPS Cloudinary URL (what we store in the DB)
// req.file.filename → Cloudinary public_id
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:         'jbs-uploads',        // Cloudinary folder
    format:         'webp',               // Convert everything to WebP
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    public_id:      `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  }),
});

// ─── File Type Filter ─────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

// ─── Multer Instance ──────────────────────────────────────────────────────────
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter,
});

// ─── processImage — no-op (Cloudinary handles conversion) ────────────────────
// Kept for API compatibility with existing route definitions.
const processImage = (req, res, next) => next();

// ─── handleUpload ─────────────────────────────────────────────────────────────
// Wraps a multer middleware call with consistent JSON error responses.
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Image upload failed. Unexpected field: ${err.field}`,
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed. File exceeds the 5 MB limit.',
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

module.exports = { upload, processImage, handleUpload };