const User = require("../models/User");
const Match = require("../models/Match");
const { successResponse, errorResponse } = require("../helpers/responseHelper");
const mongoose = require('mongoose');

const registerSwipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'User not found', 404);
    }

    const currentUser = await User.findById(currentUserId);

    if (action === 'like') {
      if (currentUser.likes.includes(targetUserId)) {
        return errorResponse(res, 'You have already given like to this user', 400);
      }

      currentUser.likes.push(targetUserId);
      await currentUser.save();

      if (targetUser.likes.includes(currentUserId)) {
        const existingMatch = await Match.findMatch(currentUserId, targetUserId);
        
        if (!existingMatch) {
          const newMatch = new Match({
            user1: currentUserId,
            user2: targetUserId
          });
          await newMatch.save();

          return successResponse(res, {
            isMatch: true,
            matchId: newMatch._id,
            message: '¡Es un match!',
            user: targetUser
          });
        }
      }

      return successResponse(res, {
        isMatch: false,
        message: 'Like registrado'
      });

    } else if (action === 'dislike') {
      if (!currentUser.dislikes.includes(targetUserId)) {
        currentUser.dislikes.push(targetUserId);
        await currentUser.save();
      }

      return successResponse(res, {
        message: 'Dislike registrado' 
      });
    } else {
      return errorResponse(res, 'Acción inválida', 400);
    }

  } catch (error) {
    console.error('Error in registerSwipe:', error);
    return errorResponse(res);
  }
};

const getMatchesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'Formato de ID de usuario inválido',
        error: 'Formato de ID de usuario inválido'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado',
        error: 'Usuario no encontrado'
      });
    }

    const matches = await Match.find({
      $or: [
        { user1: userId },
        { user2: userId }
      ],
      isActive: true
    })
    .populate({
      path: 'user1 user2',
      select: '_id email name photos bio age gender'
    });

  
    const matchedUsers = matches.map(match => {
      const matchedUser = match.user1._id.toString() === userId ? match.user2 : match.user1;
      return {
        matchId: match._id,
        userId: matchedUser._id,
        email: matchedUser.email,
        name: matchedUser.name,
        photos: matchedUser.photos,
        bio: matchedUser.bio,
        age: matchedUser.age,
        gender: matchedUser.gender,
        lastMessage: match.lastMessage,
        lastMessageAt: match.lastMessageAt
      };
    });

    res.status(200).json({
      message: 'Matches encontrados exitosamente',
      matches: matchedUsers
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener matches',
      error: error.message 
    });
  }
};

module.exports = {
  registerSwipe,
  getMatchesByUser
};
