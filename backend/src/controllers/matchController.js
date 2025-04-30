const User = require("../models/User");
const { successResponse, errorResponse } = require("../helpers/responseHelper");

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
      if (currentUser.matches.includes(targetUserId)) {
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
        // ¡Es un match!
        currentUser.matches.push(targetUserId);
        targetUser.matches.push(currentUserId);
        await currentUser.save();
        await targetUser.save();

        return successResponse(res, {
          isMatch: true,
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

// Obtener matches del usuario
const getMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    const currentUser = await User.findById(currentUserId)
      .populate('matches', 'name age photos bio');

    return successResponse(res, {
      matches: currentUser.matches
    });

  } catch (error) {
    console.error('Error en getMatches:', error);
    return errorResponse(res);
  }
};

module.exports = {
  registerSwipe,
  getMatches
};
