const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getTestimonials)
  .post(protect, upload.single('image'), processImage, createTestimonial);

router.route('/:id')
  .put(protect, upload.single('image'), processImage, updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;
