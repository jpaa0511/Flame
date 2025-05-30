const express = require("express");
const {
  findPotentialMatches
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/potential-matches", verifyToken, findPotentialMatches);

module.exports = router;
