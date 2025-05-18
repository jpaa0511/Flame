const User = require("../models/User");
const { comparePassword, hashPassword } = require("../middlewares/authMiddleware");
const { generateToken, errorResponse, authResponse } = require("../helpers/responseHelper");
const { validationResult } = require('express-validator');

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Usuario no registrado', 404);
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Contraseña incorrecta', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    return authResponse(res, user, token);

  } catch (error) {
    console.error('Error in login:', error);
    return errorResponse(res);
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    console.log('Received registration data:', req.body);
    
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return errorResponse(res, errors.array()[0].msg, 400);
    }

    const { email, password, name, age, gender, city } = req.body;
    console.log('Processing registration for:', { email, name, age, gender, city });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return errorResponse(res, 'El correo ya está registrado', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      city,
      photos: [],
      bio: '',
      verified: false,
      likes: [],
      dislikes: [],
      department: '' // Valor por defecto
    });

    console.log('Attempting to save user...');
    await user.save();
    console.log('User saved successfully:', user._id);

    // Generate token
    const token = generateToken(user);

    return authResponse(res, user, token);

  } catch (error) {
    console.error('Error in register:', error);
    if (error.name === 'ValidationError') {
      return errorResponse(res, 'Datos inválidos: ' + Object.values(error.errors).map(e => e.message).join(', '), 400);
    }
    return errorResponse(res, 'Error al registrar usuario: ' + error.message, 500);
  }
};

module.exports = { loginUser, registerUser };
