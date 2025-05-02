const express = require('express');
const router = express.Router();
const { getChatHistory } = require('../controllers/chatController');

// Obtener historial de chat
router.get('/history/:matchId', getChatHistory);

module.exports = router; 