const multer = require('multer');
const path = require('path');
const fs = require('fs');

// FULL ABSOLUTE UPLOADS PATH
const uploadDir = path.join(__dirname, '..', 'uploads');

// CREATE FOLDER IF NOT EXISTS
if (!fs.existsSync(uploadDir)) {

  fs.mkdirSync(uploadDir, { recursive: true });

}

// STORAGE CONFIG
const storage = multer.diskStorage({

  destination(req, file, cb) {

    cb(null, uploadDir);

  },

  filename(req, file, cb) {

    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    );

  },

});

// FILE TYPE CHECK
const checkFileType = (file, cb) => {

  const filetypes = /jpg|jpeg|png|webp|svg/;

  const extname = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {

    return cb(null, true);

  } else {

    cb(new Error('Images only!'));

  }

};

// MULTER CONFIG
const upload = multer({

  storage,

  fileFilter(req, file, cb) {

    checkFileType(file, cb);

  },

});

module.exports = upload;