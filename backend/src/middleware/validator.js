import { body, validationResult } from "express-validator";

export const clientLoginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .toLowerCase(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const adminLoginRules = [
  body("adminName").trim().notEmpty().withMessage("Admin Name is required."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .toLowerCase(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
