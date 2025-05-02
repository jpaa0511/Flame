const Message = require('../models/Message');
const Match = require('../models/Match');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

// Get message history between two users
const getChatHistory = async (req, res) => {
  try {
    const { matchId } = req.params;

    // Verify that the match exists
    const match = await Match.findOne({
      _id: matchId,
      isActive: true
    });

    if (!match) {
      return errorResponse(res, 'Match not found', 404);
    }

    const messages = await Message.find({
      match: matchId
    })
    .sort({ createdAt: 1 })
    .select('sender content createdAt');

    return successResponse(res, { messages });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return errorResponse(res, error.message);
  }
};

module.exports = {
  getChatHistory
}; 