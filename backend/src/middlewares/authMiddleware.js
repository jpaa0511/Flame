const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { errorResponse } = require('../helpers/responseHelper');
const User = require('../models/User');

// Encrypt password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return errorResponse(res, 'No se proporcionó token de autenticación', 401);
    }

    // Verificar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar el usuario usando el ID correcto del payload
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('Token decodificado:', decoded); 
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    // Adjuntar el usuario al request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token inválido', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expirado', 401);
    }
    return errorResponse(res, 'Error de autenticación', 500);
  }
};

// Función para generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = {
  hashPassword,
  comparePassword,
  verifyToken,
  generateToken
}; 