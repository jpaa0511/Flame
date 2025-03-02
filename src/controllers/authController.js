const { users } = require("../models/users");

// Iniciar sesión
const loginUser = (req, res) => {
  const { userId } = req.body;
  const user = users.find((u) => u.userId === userId);

  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  res.json({ message: "Login exitoso", user });
};

module.exports = { loginUser };
