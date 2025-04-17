const express = require("express");
const { registerSwipe, getMatches } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/swipes", validateSwipe, registerSwipe);
router.get("/matches", getMatches);

module.exports = router;
