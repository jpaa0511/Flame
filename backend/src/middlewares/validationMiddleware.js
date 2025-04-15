const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .notEmpty()
    .withMessage("Age is required")
    .isInt({ min: 18, max: 100 })
    .withMessage("Age must be a number between 18 and 100"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be 'male', 'female', or 'other'"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("city")
    .notEmpty()
    .withMessage("City is required"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("Interests must be an array"),

  body("photos")
    .optional()
    .isArray()
    .withMessage("Photos must be an array"),

  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  body("preferences.gender")
    .optional()
    .isIn(["male", "female", "other", "any"])
    .withMessage("Preferences.gender must be 'male', 'female', 'other', or 'any'"),

  body("preferences.ageRange.min")
    .optional()
    .isInt({ min: 18 })
    .withMessage("Minimum age must be at least 18"),

  body("preferences.ageRange.max")
    .optional()
    .isInt({ max: 100 })
    .withMessage("Maximum age must be no more than 100"),

  body("preferences.location.department")
    .optional()
    .isString()
    .withMessage("preferences.location.department must be a string"),

  body("preferences.location.city")
    .optional()
    .isString()
    .withMessage("preferences.location.city must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// COMENTADO PORQUE NO SON DATOS DE LA BD, ORGANIZAR PARA UTILIZAR MODELO NUEVO.
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
