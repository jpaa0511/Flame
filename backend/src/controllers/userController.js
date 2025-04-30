const User = require("../models/User");
const { hashPassword } = require("../middlewares/authMiddleware");
const { generateToken, errorResponse, authResponse, successResponse } = require("../helpers/responseHelper");

// Get available users for swiping
const getAvailableUsers = async (req, res) => {
  try {
    // Get current user preferences
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Build query based on user preferences
    const query = {
      _id: { $ne: req.user.id }, // Exclude current user
      isRegistrationComplete: true,
      age: {
        $gte: currentUser.preferences.ageRange.min,
        $lte: currentUser.preferences.ageRange.max
      }
    };

    // Add gender preference if specified
    if (currentUser.preferences.gender !== 'any') {
      query.gender = currentUser.preferences.gender;
    }

    // Add location preference if specified
    if (currentUser.preferences.location.department) {
      query.department = currentUser.preferences.location.department;
    }
    if (currentUser.preferences.location.city) {
      query.city = currentUser.preferences.location.city;
    }

    // Get available users
    const availableUsers = await User.find(query)
      .select('-password -__v') // Exclude sensitive fields
      .limit(20); // Limit results

    return successResponse(res, availableUsers, 'Usuarios disponibles obtenidos correctamente');

  } catch (error) {
    console.error('Error al obtener usuarios disponibles:', error);
    return errorResponse(res);
  }
};

// Register User
const registerUser = async (req, res) => {
  const {
    name,
    age,
    email,
    gender,
    department,
    city,
    interests,
    photos,
    bio,
    preferences,
    password
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'El email ya está registrado', 400);
    }

    // Password hash
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      age,
      email,
      gender,
      department,
      city,
      interests: interests || [],
      photos: photos || [],
      bio,
      password: hashedPassword,
      preferences: preferences || {
        gender: "any",
        ageRange: {
          min: 18,
          max: 99
        },
        location: {
          department: "",
          city: ""
        }
      }
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser);

    return authResponse(res, savedUser, token);

  } catch (error) {
    console.log(error);
    return errorResponse(res, 'Oops, something went wrong!', 400);
  }
};

module.exports = { 
  registerUser,
  getAvailableUsers 
};
