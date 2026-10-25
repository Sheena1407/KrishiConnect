const express = require('express');
const router = express.Router();
const {
  getActivities,
  createActivity,
  updateActivity,
  toggleStatus,
  deleteActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getActivities).post(createActivity);
router.route('/:id').put(updateActivity).delete(deleteActivity);
router.patch('/:id/toggle', toggleStatus);

module.exports = router;
