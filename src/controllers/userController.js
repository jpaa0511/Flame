const { users, matches } = require("../models/users");

// Registrar usuario
const registerUser = (req, res) => {
  const { userId, name } = req.body;
  users.push({ userId, name });
  res.json({ message: "Usuario registrado", userId });
};

// Obtener lista de usuarios
const getUsers = (req, res) => {
  res.json(users);
  console.log(users)
};

const getAvailableUsers = (req, res) => {
  const { userId } = req.body;

  // Obtener la lista de usuarios que no tienen match con el usuario actual
  const availableUsers = users.filter((user) => {
    if (user.userId === userId) {
      return false;
    }

    // Verificar si hay un match existente
    for (const match of matches) {
      if (
        (match.user1 === userId && match.user2 === user.userId) ||
        (match.user1 === user.userId && match.user2 === userId)
      ) {
        return false;
      }
    }

    return true;
  });

  res.json(availableUsers);
};

module.exports = { registerUser, getUsers, getAvailableUsers };
