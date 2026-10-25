const express = require('express');
const router = express.Router();
const {
  getExperts,
  createExpert,
  updateExpert,
  deleteExpert,
  bookConsultation,
  getMyConsultations,
  getAllConsultations,
  updateConsultation,
} = require('../controllers/expertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getExperts);
router.post('/', protect, authorize('Admin'), createExpert);
router.put('/:id', protect, authorize('Admin'), updateExpert);
router.delete('/:id', protect, authorize('Admin'), deleteExpert);

router.post('/consultations', protect, bookConsultation);
router.get('/consultations/my', protect, getMyConsultations);
router.get('/consultations/all', protect, authorize('Admin'), getAllConsultations);
router.put('/consultations/:id', protect, updateConsultation);

module.exports = router;
