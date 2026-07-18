const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, upload.single('image'), processImage, createService);

router.route('/:id')
  .put(protect, upload.single('image'), processImage, updateService)
  .delete(protect, deleteService);

module.exports = router;
