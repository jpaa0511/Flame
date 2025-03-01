const { swipes, matches } = require("../models/users");

// Registrar swipe
const registerSwipe = (req, res) => {
    const { userId, targetUserId, action } = req.body;

    if (!userId || !targetUserId || !action) return res.status(400).json({ error: "Faltan datos" });

    swipes.push({ userId, targetUserId, action });

    // Verificar si hay match
    const existingSwipe = swipes.find(s => s.userId === targetUserId && s.targetUserId === userId && s.action === "like");
    if (existingSwipe && action === "like") {
        matches.push({ user1: userId, user2: targetUserId });
        return res.json({ match: true, message: "You have a new match!" });
    }

    res.json({ match: false, message: "Swipe registrado" });
};

// Obtener matches
const getMatches = (req, res) => {
    res.json(matches);
};

module.exports = { registerSwipe, getMatches };