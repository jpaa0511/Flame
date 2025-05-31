const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
};

const successResponse = (res, data, message = 'Operation successful', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Server error', status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};

const authResponse = (res, user, token) => {
  return successResponse(res, {
    user: formatUserResponse(user),
    token
  });
};

module.exports = {
  formatUserResponse,
  successResponse,
  errorResponse,
  authResponse
}; 