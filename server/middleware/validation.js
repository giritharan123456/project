const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain uppercase letter')
    .matches(/[a-z]/).withMessage('Must contain lowercase letter')
    .matches(/[0-9]/).withMessage('Must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Must contain special character'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  handleValidationErrors
];

const resetPasswordValidation = [
  param('token').notEmpty().withMessage('Reset token required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain uppercase letter')
    .matches(/[a-z]/).withMessage('Must contain lowercase letter')
    .matches(/[0-9]/).withMessage('Must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Must contain special character'),
  handleValidationErrors
];

const updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').optional()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Must contain uppercase letter')
    .matches(/[a-z]/).withMessage('Must contain lowercase letter')
    .matches(/[0-9]/).withMessage('Must contain number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Must contain special character'),
  handleValidationErrors
];

const pincodeValidation = [
  param('pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'),
  handleValidationErrors
];

const districtValidation = [
  param('districtId').isMongoId().withMessage('Valid district ID required'),
  handleValidationErrors
];

const areaSearchValidation = [
  query('q').trim().isLength({ min: 1, max: 100 }).withMessage('Search query required'),
  handleValidationErrors
];

const areaValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Area name required'),
  body('pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode required'),
  body('district').isMongoId().withMessage('Valid district ID required'),
  body('population').optional().isInt({ min: 0 }).withMessage('Population must be positive integer'),
  body('coordinates.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Valid latitude required'),
  body('coordinates.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Valid longitude required'),
  handleValidationErrors
];

const districtValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('District name required'),
  body('state').trim().isLength({ min: 2, max: 50 }).withMessage('State required'),
  body('population').optional().isInt({ min: 0 }).withMessage('Population must be positive'),
  handleValidationErrors
];

const comparisonValidation = [
  body('areas').isArray({ min: 2, max: 5 }).withMessage('2-5 areas required for comparison'),
  body('areas.*').isMongoId().withMessage('Valid area IDs required'),
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  pincodeValidation,
  districtValidation,
  areaSearchValidation,
  areaValidation,
  districtValidation,
  comparisonValidation,
  handleValidationErrors
};