const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getOrders, updateOrderStatus, trackOrder } = require('../controllers/orderController');

// Public routes
router.post('/', createOrder);
router.get('/track/:trackingId', trackOrder); // <-- NEW

// Admin routes
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;