const express = require('express');
const router = express.Router();
const { getRecommendations, getCatalog } = require('../controllers/cropAdvisorController');

router.post('/recommend', getRecommendations);
router.get('/crops', getCatalog);

module.exports = router;
