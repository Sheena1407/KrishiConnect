const express = require('express');
const router = express.Router();
const { getFarmerAnalytics, getAdminAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/farmer', getFarmerAnalytics);
router.get('/admin', authorize('Admin'), getAdminAnalytics);

module.exports = router;
