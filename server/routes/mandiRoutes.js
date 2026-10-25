const express = require('express');
const router = express.Router();
const { getMandi } = require('../controllers/mandiController');

router.get('/', getMandi);

module.exports = router;
