const { users, matches } = require("../models/users"); // Eliminar porque es un maquetado de la primera entrega
const User = require("../modelos/User");

// RegisterUser
const registerUser = async (req, res) => {
  const {
    name,
    age,
    email,
    gender,
    department,
    city,
    interests,
    photos,
    bio,
    preferences,
  } = req.body;

  const newUser = new User({
    name,
    age,
    email,
    gender,
    department,
    city,
    interests,
    photos,
    bio,
    preferences,
  });

  try {
    const newRecord = await newUser.save();
    res.status(201).json({
      newRecord
    });
  } catch (error) {
    console.log();
    res.status(400).json({ message: error.message });
  }
};

// Obtener lista de usuarios
const getUsers = (req, res) => {
  res.json(users);
  console.log(users);
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
