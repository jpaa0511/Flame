const express = require("express");
const { registerSwipe, getMatchesByUser } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/swipes", verifyToken, validateSwipe, registerSwipe);
router.get("/:userId", getMatchesByUser);

module.exports = router;
