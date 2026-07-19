const express = require('express');
const router = express.Router();
const { getServices, getServiceBySlug, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage, handleUpload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, handleUpload(upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])), processImage, createService);

router.route('/:slug')
  .get(getServiceBySlug);

router.route('/:id')
  .put(protect, handleUpload(upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }])), processImage, updateService)
  .delete(protect, deleteService);

module.exports = router;
