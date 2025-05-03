const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({
    id: user._id,
    name: user.name,
    email: user.email
  }, JWT_SECRET, { expiresIn: "1h" });
};

// Helper to format the user response
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};

// Helper for successful responses
const successResponse = (res, data, message = 'Operation successful', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

// Helper for error responses
const errorResponse = (res, message = 'Server error', status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};

// Helper for authentication responses
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