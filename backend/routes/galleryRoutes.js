const express = require('express');
const router = express.Router();
const { getGallery, createGallery, updateGallery, deleteGallery } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getGallery)
  .post(protect, upload.single('image'), processImage, createGallery);

router.route('/:id')
  .put(protect, upload.single('image'), processImage, updateGallery)
  .delete(protect, deleteGallery);

module.exports = router;
