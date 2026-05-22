const { Router } = require('express')
const { body } = require('express-validator')
const controller = require('../controllers/patientController')
const authenticate = require('../middleware/auth')
const validate = require('../middleware/validate')

const updatePatient = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional(),
]

const router = Router()

router.get('/', authenticate, controller.getAll)
router.get('/:id', authenticate, controller.getById)
router.put('/:id', authenticate, updatePatient, validate, controller.update)

module.exports = router
