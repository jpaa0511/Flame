const User = require("../models/User");
const { comparePassword } = require("../middlewares/authMiddleware");
const { generateToken, errorResponse, authResponse } = require("../helpers/responseHelper");

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 'Email o contraseña incorrectos', 401);
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 'Email o contraseña incorrectos', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    return authResponse(res, user, token);

  } catch (error) {
    console.error('Error en login:', error);
    return errorResponse(res);
  }
};

module.exports = { loginUser };
