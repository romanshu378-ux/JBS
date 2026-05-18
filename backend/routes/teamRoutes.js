const express = require('express');
const router = express.Router();
const { getTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getTeam)
  .post(protect, upload.single('image'), createTeamMember);

router.route('/:id')
  .put(protect, upload.single('image'), updateTeamMember)
  .delete(protect, deleteTeamMember);

module.exports = router;
