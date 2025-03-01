const express = require("express");
const { registerSwipe, getMatches } = require("../controllers/matchController");
const router = express.Router();

router.post("/swipes", registerSwipe);
router.get("/matches", getMatches);

module.exports = router;