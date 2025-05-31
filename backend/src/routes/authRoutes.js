const express = require("express");
const { loginUser, registerUser, logoutUser, checkEmailExists } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { validateLogin, validateRegister } = require("../middlewares/validationMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/login", validateLogin, loginUser);

router.post("/register", upload, validateRegister, registerUser);

router.get("/check-email", checkEmailExists);

router.post("/logout", logoutUser);

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

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

module.exports = router;