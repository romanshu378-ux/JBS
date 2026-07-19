const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/serviceCategoryController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage, handleUpload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, handleUpload(upload.single('image')), processImage, createCategory);

router.route('/:id')
  .put(protect, handleUpload(upload.single('image')), processImage, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
