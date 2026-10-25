const express = require('express');
const router = express.Router();
const {
  getPestAlerts,
  createPestAlert,
  updatePestAlert,
  deletePestAlert,
} = require('../controllers/pestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getPestAlerts);
router.post('/', protect, authorize('Admin'), createPestAlert);
router.put('/:id', protect, updatePestAlert);
router.delete('/:id', protect, authorize('Admin'), deletePestAlert);

module.exports = router;
