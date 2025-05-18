const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El formato del correo electrónico no es válido")
    .trim()
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

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

  body("city")
    .notEmpty()
    .withMessage("La ciudad es requerida")
    .trim(),

  body("department")
    .optional()
    .trim()
    .default(''),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Los intereses deben ser una lista"),

  body("photos")
    .optional()
    .isArray()
    .withMessage("Las fotos deben ser una lista"),

  body("bio")
    .optional()
    .isString()
    .withMessage("La biografía debe ser un texto"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("The preferences must be an object"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }
    next();
  }
];

// Login validation
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("El correo electrónico es requerido")
    .isEmail()
    .withMessage("El formato del correo electrónico no es válido"),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validación de Swipes
const validateSwipe = [
  body("targetUserId")
    .notEmpty()
    .withMessage("The target user ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),

  body("action")
    .notEmpty()
    .withMessage("The action is required")
    .isIn(["like", "dislike"])
    .withMessage("The action must be 'like' or 'dislike'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { 
  validateLogin, 
  validateSwipe, 
  validateRegister 
};
