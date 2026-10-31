const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getApprovedReviews, getAllReviews, addReview, toggleApproval, deleteReview } = require('../controllers/reviewController');

router.get('/', getApprovedReviews); // Public
router.post('/', addReview); // Public

router.get('/admin', protect, getAllReviews); // Admin
router.put('/:id/approve', protect, toggleApproval); // Admin
router.delete('/:id', protect, deleteReview); // Admin

module.exports = router;