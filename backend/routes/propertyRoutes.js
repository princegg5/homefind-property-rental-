const express = require('express');
const router = express.Router();
const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAdminStats,
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/admin/stats', protect, admin, getAdminStats);
router.get('/:id', getPropertyById);

// Protected routes (Admin or Owner)
router.post('/', protect, admin, createProperty);
router.put('/:id', protect, admin, updateProperty);
router.delete('/:id', protect, admin, deleteProperty);

module.exports = router;
