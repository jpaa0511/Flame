const express = require("express");
const { registerSwipe, getMatchesByUser } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/swipes", verifyToken, validateSwipe, registerSwipe);
router.get("/matches-by-user", verifyToken, getMatchesByUser);

module.exports = router;
