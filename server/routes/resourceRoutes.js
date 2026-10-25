const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, authorize('Admin'), createResource);
router.put('/:id', protect, authorize('Admin'), updateResource);
router.delete('/:id', protect, authorize('Admin'), deleteResource);

module.exports = router;
