const express = require('express');
const router  = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect }                     = require('../middleware/authMiddleware');
const { upload, processImage }        = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getSettings)
  // Multipart upload fields (logo, favicon) are optional.
  // When the request is plain JSON the upload middleware simply passes through.
  .put(
    protect,
    upload.fields([
      { name: 'logo',    maxCount: 1 },
      { name: 'favicon', maxCount: 1 },
    ]),
    processImage,
    updateSettings
  );

module.exports = router;
