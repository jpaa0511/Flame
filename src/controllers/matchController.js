const { swipes, matches } = require("../models/users");

// Registrar swipe
const registerSwipe = (req, res) => {
  const { userId, targetUserId, action } = req.body;

  swipes.push({ userId, targetUserId, action });

  // Verificar si hay match
  const existingSwipe = swipes.find(
    (s) =>
      s.userId === targetUserId &&
      s.targetUserId === userId &&
      s.action === "like"
  );
  if (existingSwipe && action === "like") {
    matches.push({ user1: userId, user2: targetUserId });
    return res.json({ match: true, message: "Se gustaron!" });
  }

  res.json({ match: false, message: "Accion registrada" });
};

// Obtener matches
const getMatches = (req, res) => {
  res.json(matches);
};

module.exports = { registerSwipe, getMatches };
