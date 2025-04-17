const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Formato de email inválido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido"),

  body("age")
    .notEmpty()
    .withMessage("La edad es requerida")
    .isInt({ min: 18, max: 100 })
    .withMessage("La edad debe estar entre 18 y 100 años"),

  body("gender")
    .notEmpty()
    .withMessage("El género es requerido")
    .isIn(["male", "female", "other"])
    .withMessage("El género debe ser 'male', 'female' u 'other'"),

  body("department")
    .notEmpty()
    .withMessage("El departamento es requerido"),

  body("city")
    .notEmpty()
    .withMessage("La ciudad es requerida"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Los intereses deben ser un array"),

  body("photos")
    .optional()
    .isArray()
    .withMessage("Las fotos deben ser un array"),

  body("bio")
    .optional()
    .isString()
    .withMessage("La biografía debe ser un texto"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Las preferencias deben ser un objeto"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Login validation
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Formato de email inválido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validación de Matches
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

module.exports = { 
  validateLogin, 
  validateSwipe, 
  validateRegister 
};
