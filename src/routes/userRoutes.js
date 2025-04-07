const express = require("express");
const {
  registerUser,
  getUsers,
  getAvailableUsers,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { validateRegister } = require("../middlewares/validationMiddleware");
const User = require('../modelos/User')
const router = express.Router();

// EndPoints con middleware
router.post("/register", validateRegister, registerUser);
router.get("/users", getUsers);
router.post("/available", authenticateUser, getAvailableUsers);

// Register user
router.post("/RegistroUsuario",validateRegister, registerUser)

module.exports = router;
