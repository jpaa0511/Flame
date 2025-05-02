const Message = require('../models/Message');
const Match = require('../models/Match');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Obtener el historial de mensajes entre dos usuarios
const getChatHistory = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Verificar que el match existe
    const match = await Match.findOne({
      _id: matchId,
      isActive: true
    });

    if (!match) {
      return errorResponse(res, 'Match no encontrado', 404);
    }

    const messages = await Message.find({
      match: matchId
    })
    .sort({ createdAt: 1 })
    .select('sender content createdAt');

    return successResponse(res, { messages });
  } catch (error) {
    console.error('Error en getChatHistory:', error);
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getChatHistory
}; 