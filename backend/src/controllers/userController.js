const User = require("../models/User");
const { successResponse, errorResponse } = require("../helpers/responseHelper");

const findPotentialMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    console.log('Usuario actual:', {
      id: currentUser._id,
      gender: currentUser.gender,
      age: currentUser.age,
      preferences: currentUser.preferences
    });

    // Construir la consulta para encontrar usuarios que coincidan con las preferencias
    const query = {
      _id: { $ne: req.user.id }, // Excluir al usuario actual
      gender: currentUser.preferences.gender, // Género que busca el usuario actual
      age: {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      },
      'preferences.gender': currentUser.gender, // El usuario debe estar interesado en el género del usuario actual
      'preferences.ageRange.min': { $lte: currentUser.age }, // La edad mínima que busca debe ser menor o igual a la edad actual
      'preferences.ageRange.max': { $gte: currentUser.age } // La edad máxima que busca debe ser mayor o igual a la edad actual
    };

    // Agregar preferencias de ubicación si están especificadas
    if (currentUser.preferences.location.department) {
      query.department = currentUser.preferences.location.department;
    }
    if (currentUser.preferences.location.city) {
      query.city = currentUser.preferences.location.city;
    }

    // Excluir usuarios que ya han sido likeados o dislikeados
    if (currentUser.likes.length > 0 || currentUser.dislikes.length > 0) {
      query._id = {
        $nin: [...currentUser.likes, ...currentUser.dislikes]
      };
    }

    console.log('Query de búsqueda:', JSON.stringify(query, null, 2));

    const potentialMatches = await User.find(query)
      .select('-password -__v')
      .limit(20);

    console.log('Matches encontrados:', potentialMatches.length);

    return successResponse(res, potentialMatches, 'Posibles matches encontrados exitosamente');

  } catch (error) {
    console.error('Error en findPotentialMatches:', error);
    return errorResponse(res);
  }
};

module.exports = { 
  findPotentialMatches
};
