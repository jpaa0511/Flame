const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Helper para generar token JWT
const generateToken = (user) => {
  return jwt.sign({
    id: user._id,
    name: user.name,
    email: user.email
  }, JWT_SECRET, { expiresIn: "1h" });
};

// Helper para formatear la respuesta de usuario
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};

// Helper para respuestas exitosas
const successResponse = (res, data, message = 'Operación exitosa', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

// Helper para respuestas de error
const errorResponse = (res, message = 'Error en el servidor', status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};

// Helper para respuestas de autenticación
const authResponse = (res, user, token) => {
  return successResponse(res, {
    user: formatUserResponse(user),
    token
  });
};

module.exports = {
  generateToken,
  formatUserResponse,
  successResponse,
  errorResponse,
  authResponse
}; 