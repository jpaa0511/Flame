const express = require("express");
const {
  registerUser,
  getAvailableUsers,
} = require("../controllers/userController");
const { validateRegister } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/register", validateRegister, registerUser);
router.get("/available", verifyToken, getAvailableUsers);

module.exports = router;
