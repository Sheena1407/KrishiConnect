const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/all', authorize('Admin'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('Admin'), updateOrderStatus);

module.exports = router;
