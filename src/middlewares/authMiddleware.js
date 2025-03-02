const { users } = require("../models/users");

// Validar usuario
const authenticateUser = (req, res, next) => {
  const { userId } = req.body;
  const user = users.find((u) => u.userId === userId);
  if (!user) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }
  next();
};

module.exports = { authenticateUser };
