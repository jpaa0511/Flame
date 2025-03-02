const express = require("express");
const {
  registerUser,
  getUsers,
  getAvailableUsers,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const { validateRegister } = require("../middlewares/validationMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/register", validateRegister, registerUser);
router.get("/users", authenticateUser, getUsers);
router.post("/available", authenticateUser, getAvailableUsers);

module.exports = router;
