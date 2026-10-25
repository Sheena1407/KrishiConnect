const express = require('express');
const router = express.Router();
const { diagnose, getSupportedDiseases } = require('../controllers/cropDoctorController');

router.post('/diagnose', diagnose);
router.get('/list', getSupportedDiseases);

module.exports = router;
