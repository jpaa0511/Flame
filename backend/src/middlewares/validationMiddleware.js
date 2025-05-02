const { body, validationResult } = require("express-validator");

const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("The email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("The password is required")
    .isLength({ min: 6 })
    .withMessage("The password must be at least 6 characters long"),

  body("name")
    .notEmpty()
    .withMessage("The name is required"),

  body("age")
    .notEmpty()
    .withMessage("The age is required")
    .isInt({ min: 18, max: 100 })
    .withMessage("The age must be between 18 and 100 years"),

  body("gender")
    .notEmpty()
    .withMessage("The gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("The gender must be 'male', 'female' or 'other'"),

  body("department")
    .notEmpty()
    .withMessage("The department is required"),

  body("city")
    .notEmpty()
    .withMessage("The city is required"),

  body("interests")
    .optional()
    .isArray()
    .withMessage("The interests must be an array"),

  body("photos")
    .optional()
    .isArray()
    .withMessage("The photos must be an array"),

  body("bio")
    .optional()
    .isString()
    .withMessage("The biography must be a text"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("The preferences must be an object"),

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
    .withMessage("The email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("The password is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
