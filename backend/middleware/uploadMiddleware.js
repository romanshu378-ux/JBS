const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadPath = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only Images Allowed'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

const processImage = async (req, res, next) => {
  if (!req.file && (!req.files || Object.keys(req.files).length === 0)) {
    return next();
  }

  try {
    const processSingle = async (file) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const filepath = path.join(uploadPath, filename);

      await sharp(file.buffer)
        .webp({ quality: 80 })
        .toFile(filepath);

      file.filename = filename;
      file.path = filepath;
      file.mimetype = 'image/webp';
    };

    if (req.file) {
      await processSingle(req.file);
    }

    if (req.files) {
      for (const fieldname in req.files) {
        for (const file of req.files[fieldname]) {
          await processSingle(file);
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    next(error);
  }
};

const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            success: false,
            message: `Image upload failed. Expected field: ${err.field}`
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image upload failed. File size exceeds the 5MB limit.'
          });
        }
        return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
};

module.exports = { upload, processImage, handleUpload };