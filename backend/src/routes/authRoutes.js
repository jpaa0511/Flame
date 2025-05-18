const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const { validateLogin, validateRegister } = require("../middlewares/validationMiddleware");
const router = express.Router();

// Login endpoint
router.post("/login", validateLogin, loginUser);

// Register endpoint
router.post("/register", validateRegister, registerUser);

module.exports = router;
