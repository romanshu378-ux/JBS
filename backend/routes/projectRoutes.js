const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getProjects)
  .post(protect, upload.single('image'), processImage, createProject);

router.route('/:id')
  .put(protect, upload.single('image'), processImage, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
