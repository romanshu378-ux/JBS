const express = require('express');
const router = express.Router();
const { getInquiries, createInquiry, updateInquiryStatus, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getInquiries)
  .post(createInquiry); // Public route for frontend

router.route('/:id')
  .put(protect, updateInquiryStatus)
  .delete(protect, deleteInquiry);

module.exports = router;
