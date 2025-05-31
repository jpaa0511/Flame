const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');

router.get('/history/:matchId', getChatHistory);

module.exports = router; 