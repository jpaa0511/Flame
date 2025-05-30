const User = require("../models/User");
const Match = require("../models/Match");
const { successResponse, errorResponse } = require("../helpers/responseHelper");

const registerSwipe = async (req, res) => {
  try {
    const { targetUserId, action } = req.body;
    const currentUserId = req.user.id;

    // Validación para evitar que un usuario interactúe consigo mismo
    if (currentUserId === targetUserId) {
      return errorResponse(res, 'No puedes interactuar contigo mismo', 400);
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    const currentUser = await User.findById(currentUserId);

    if (action === 'like') {
      if (currentUser.likes.includes(targetUserId)) {
        return errorResponse(res, 'Ya le diste like a este usuario', 400);
      }

      // Agregar el like al usuario actual
      currentUser.likes.push(targetUserId);
      await currentUser.save();

      // Verificar si hay match (si el otro usuario también dio like)
      if (targetUser.likes.includes(currentUserId)) {
        // Verificar si ya existe un match entre estos usuarios
        const existingMatch = await Match.findOne({
          $or: [
            { user1: currentUserId, user2: targetUserId },
            { user1: targetUserId, user2: currentUserId }
          ],
          isActive: true
        });

        if (!existingMatch) {
          // Crear nuevo match
          const newMatch = new Match({
            user1: currentUserId,
            user2: targetUserId
          });

          try {
            await newMatch.save();
            return successResponse(res, {
              isMatch: true,
              matchId: newMatch._id,
              message: '¡Es un match!',
              user: targetUser
            });
          } catch (error) {
            // Si hay un error de duplicado, verificar si el match existe
            if (error.code === 11000) {
              const match = await Match.findOne({
                $or: [
                  { user1: currentUserId, user2: targetUserId },
                  { user1: targetUserId, user2: currentUserId }
                ],
                isActive: true
              });

              if (match) {
                return successResponse(res, {
                  isMatch: true,
                  matchId: match._id,
                  message: '¡Es un match!',
                  user: targetUser
                });
              }
            }
            throw error;
          }
        } else {
          return successResponse(res, {
            isMatch: true,
            matchId: existingMatch._id,
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
    console.error('Error en registerSwipe:', error);
    return errorResponse(res);
  }
};

const getMatchesByUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Buscar todos los matches donde el usuario actual es user1 o user2
    const matches = await Match.find({
      $or: [
        { user1: currentUserId },
        { user2: currentUserId }
      ],
      isActive: true
    }).populate('user1 user2', 'name age gender photos bio interests');

    // Transformar los matches para mostrar la información del otro usuario
    const formattedMatches = matches.map(match => {
      const otherUser = match.user1._id.toString() === currentUserId ? match.user2 : match.user1;
      return {
        matchId: match._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          age: otherUser.age,
          gender: otherUser.gender,
          photos: otherUser.photos,
          bio: otherUser.bio,
          interests: otherUser.interests
        },
        lastMessage: match.lastMessage,
        lastMessageAt: match.lastMessageAt
      };
    });

    return successResponse(res, formattedMatches, 'Matches obtenidos exitosamente');

  } catch (error) {
    console.error('Error en getMatchesByUser:', error);
    return errorResponse(res);
  }
};

module.exports = {
  registerSwipe,
  getMatchesByUser
};
