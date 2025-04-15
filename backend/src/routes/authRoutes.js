const express = require("express");
const { loginUser } = require("../controllers/authController");
const { validateLogin } = require("../middlewares/validationMiddleware");
const router = express.Router();

// EndPoint con middleware
router.post("/login", validateLogin, loginUser);

module.exports = router;
