const { body } = require('express-validator')

const register = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('phone').optional().notEmpty(),
]

const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

module.exports = { register, login }
