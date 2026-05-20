const { body, param } = require('express-validator')

const createDoctor = [
  body('name').notEmpty().withMessage('Name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('specialtyId').isUUID().withMessage('Valid specialty ID is required'),
]

const updateDoctor = [
  param('id').isUUID().withMessage('Valid doctor ID is required'),
  body('name').optional().notEmpty(),
  body('lastName').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('specialtyId').optional().isUUID(),
]

const doctorId = [
  param('id').isUUID().withMessage('Valid doctor ID is required'),
]

module.exports = { createDoctor, updateDoctor, doctorId }
