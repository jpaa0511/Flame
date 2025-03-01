const { users } = require("../models/users");

// Registrar usuario
const registerUser = (req, res) => {
    const { userId, name } = req.body;
    if (!userId || !name) return res.status(400).json({ error: "Faltan datos" });

    users.push({ userId, name });
    console.log(userId, name)
    res.json({ message: "Usuario registrado", userId });
};

// Obtener lista de usuarios
const getUsers = (req, res) => {
    res.json(users);
};

module.exports = { registerUser, getUsers };