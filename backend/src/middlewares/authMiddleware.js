const bcrypt = require('bcryptjs');

// Encriptar contraseña
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparar contraseña con hash
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword }; 