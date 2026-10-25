const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleUserStatus,
  deleteUser,
  getAllFarms,
  getAllCrops,
  getAllSoilReports,
  deleteComment,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('Admin'));

router.get('/users', getUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/farms', getAllFarms);
router.get('/crops', getAllCrops);
router.get('/soil-reports', getAllSoilReports);
router.delete('/community/:postId/comments/:commentId', deleteComment);

module.exports = router;
