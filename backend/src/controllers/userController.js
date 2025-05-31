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

    const query = {
      _id: { $ne: req.user.id },
      gender: currentUser.preferences.gender,
      age: {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      },
      'preferences.gender': currentUser.gender,
      'preferences.ageRange.min': { $lte: currentUser.age },
      'preferences.ageRange.max': { $gte: currentUser.age }
    };

    if (currentUser.preferences.location.department) {
      query.department = currentUser.preferences.location.department;
    }
    if (currentUser.preferences.location.city) {
      query.city = currentUser.preferences.location.city;
    }

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
