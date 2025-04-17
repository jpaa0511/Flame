const express = require("express");
const {
  registerUser,
  getAvailableUsers,
} = require("../controllers/userController");
const { validateRegister } = require("../middlewares/validationMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/register", validateRegister, registerUser);
router.get("/available-users");

module.exports = router;
