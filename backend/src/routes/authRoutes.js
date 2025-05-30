const express = require("express");
const { loginUser, registerUser, logoutUser, checkEmailExists } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validateLogin, validateRegister } = require("../middlewares/validationMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Login endpoint
router.post("/login", validateLogin, loginUser);

// Register endpoint
router.post("/register", upload, validateRegister, registerUser);

// Logout endpoint
router.post("/logout", logoutUser);

// Verificar estado de autenticación
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

// Obtener constantes para el registro
router.get("/constants", (req, res) => {
  const { INTERESTS, DEPARTMENTS, GENDERS } = require('../constants');
  res.json({
    success: true,
    data: {
      interests: INTERESTS,
      departments: DEPARTMENTS,
      genders: GENDERS
    }
  });
});

// Verificar si el email ya existe
router.get("/check-email", checkEmailExists);

module.exports = router;
