const User = require("../models/User");
const Match = require("../models/Match");
const { successResponse, errorResponse } = require("../helpers/responseHelper");
const mongoose = require('mongoose');

// Registrar un swipe (like o dislike)
const registerSwipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user.id;

    // Verificar que el usuario objetivo existe
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Obtener el usuario actual
    const currentUser = await User.findById(currentUserId);

    if (action === 'like') {
      // Verificar si ya existe un match
      const existingMatch = await Match.findOne({
        users: { $all: [currentUserId, targetUserId] }
      });

      if (existingMatch) {
        return errorResponse(res, 'Ya existe un match con este usuario', 400);
      }

      // Verificar si ya se dio like
      if (currentUser.likes.includes(targetUserId)) {
        return errorResponse(res, 'Ya has dado like a este usuario', 400);
      }

      // Registrar el like
      currentUser.likes.push(targetUserId);
      await currentUser.save();

      // Verificar si hay match
      if (targetUser.likes.includes(currentUserId)) {
        // Crear un nuevo match
        const newMatch = new Match({
          users: [currentUserId, targetUserId]
        });
        await newMatch.save();

        return successResponse(res, {
          isMatch: true,
          matchId: newMatch._id,
          message: '¡Es un match!',
          user: targetUser
        });
      }

      return successResponse(res, {
        isMatch: false,
        message: 'Like registrado'
      });

    } else if (action === 'dislike') {
      // Registrar el dislike
      if (!currentUser.dislikes.includes(targetUserId)) {
        currentUser.dislikes.push(targetUserId);
        await currentUser.save();
      }

      return successResponse(res, {
        message: 'Dislike registrado'
      });
    } else {
      return errorResponse(res, 'Acción no válida', 400);
    }

  } catch (error) {
    console.error('Error en registerSwipe:', error);
    return errorResponse(res);
  }
};

/* Obtener matches del usuario - Esta funcion no sirve, el match debe de ser un modelo de datos, no una propiedad de los usuarios
const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    const matches = await Match.find({
      users: currentUserId,
      isActive: true
    }).populate({
      path: 'users',
      select: 'name age photos bio',
      match: { _id: { $ne: currentUserId } }
    });

    return successResponse(res, {
      matches: matches.map(match => ({
        matchId: match._id,
        user: match.users[0],
        lastMessage: match.lastMessage,
        lastMessageAt: match.lastMessageAt
      }))
    });

  } catch (error) {
    console.error('Error en getMatches:', error);
    return errorResponse(res);
  }
};*/

const getMatchesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar que el ID es válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        message: 'ID de usuario no válido',
        error: 'Invalid user ID format'
      });
    }

    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado',
        error: 'User not found'
      });
    }

    // Buscar todos los matches activos donde el usuario está involucrado
    const matches = await Match.find({
      users: userId,
      isActive: true
    })
    .populate({
      path: 'users',
      select: 'username profilePicture',
      match: { _id: { $ne: userId } } // Excluir al usuario actual
    })
    .sort({ lastMessageAt: -1 }); // Ordenar por último mensaje

    res.status(200).json({
      message: 'Matches encontrados exitosamente',
      matches
    });
  } catch (error) {
    console.error('Error al obtener matches:', error);
    res.status(500).json({ 
      message: 'Error al obtener matches',
      error: error.message 
    });
  }
};

module.exports = {
  registerSwipe,
  //getMatches,
  getMatchesByUser
};
