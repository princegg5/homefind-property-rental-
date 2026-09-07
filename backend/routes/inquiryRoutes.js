const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to submit inquiry (optionally with token if user logged in)
// We'll use a soft auth check or optional token
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalProtect, createInquiry);
router.get('/my', protect, getMyInquiries);

// Admin routes
router.get('/', protect, admin, getAllInquiries);
router.put('/:id/status', protect, admin, updateInquiryStatus);
router.delete('/:id', protect, admin, deleteInquiry);

module.exports = router;
