const express = require('express');
const router = express.Router();
const { askAssistant } = require('../controllers/assistantController');

router.post('/ask', askAssistant);

module.exports = router;
