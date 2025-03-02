const express = require("express");
const { registerSwipe, getMatches } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const { authenticateUser } = require("../middlewares/authMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/swipes", authenticateUser, validateSwipe, registerSwipe);
router.get("/matches", getMatches);

module.exports = router;
