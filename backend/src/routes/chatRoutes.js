const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');

// Get chat history
router.get('/history/:matchId', getChatHistory);

module.exports = router; 