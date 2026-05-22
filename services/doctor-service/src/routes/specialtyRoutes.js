const { Router } = require('express')
const { body } = require('express-validator')
const controller = require('../controllers/specialtyController')
const validate = require('../middleware/validate')

const createSpecialty = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').optional().notEmpty(),
]

const router = Router()

router.get('/', controller.getAll)
router.post('/', createSpecialty, validate, controller.create)

module.exports = router
