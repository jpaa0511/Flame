const { body, validationResult } = require("express-validator");

// Validacion de registro
const validateRegister = [
  body("userId").notEmpty().withMessage("userId es requerido"),
  body("name").notEmpty().withMessage("name es requerido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validacion de login
const validateLogin = [
  body("userId").notEmpty().withMessage("userId es requerido"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validacion de Matches
const validateSwipe = [
  body("userId").notEmpty().withMessage("userId es requerido"),
  body("targetUserId").notEmpty().withMessage("targetUserId es requerido"),
  body("action")
    .isIn(["like", "dislike"])
    .withMessage("action debe ser like o dislike"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLogin, validateSwipe, validateRegister };
