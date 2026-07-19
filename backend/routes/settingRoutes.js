const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getSettings)
  .put(protect, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), processImage, updateSettings);

module.exports = router;
