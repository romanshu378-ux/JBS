const express = require('express');
const router = express.Router();
const { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const { upload, processImage } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getTeam)
  .post(protect, upload.single('image'), processImage, createTeamMember);

router.route('/:id')
  .put(protect, upload.single('image'), processImage, updateTeamMember)
  .delete(protect, deleteTeamMember);

module.exports = router;
