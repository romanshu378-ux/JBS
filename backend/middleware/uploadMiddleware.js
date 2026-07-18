const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'uploads');

// Create uploads folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, uploadPath);

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

const fileFilter = (req, file, cb) => {

  const allowed = /jpg|jpeg|png|webp/;

  const ext = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );

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
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

module.exports = upload;