const express = require("express");
const { registerSwipe, getMatchesByUser } = require("../controllers/matchController");
const { validateSwipe } = require("../middlewares/validationMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

// EndPoints con middleware
router.post("/swipes", verifyToken, validateSwipe, registerSwipe);
// Este no sirve, el match debe de ser un modelo de datos, no una propiedad de los usuarios 
// router.get("/", verifyToken, getMatches);
router.get("/:userId", getMatchesByUser);

module.exports = router;
