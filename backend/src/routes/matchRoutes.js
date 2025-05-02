const express = require("express");
const { registerSwipe, getMatches } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/swipes", verifyToken, validateSwipe, registerSwipe);
router.get("/", verifyToken, getMatches);

module.exports = router;
