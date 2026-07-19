const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, setupAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.get('/setup', setupAdmin);

module.exports = router;
