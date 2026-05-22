const { Router } = require('express')
const controller = require('../controllers/doctorController')
const validate = require('../middleware/validate')
const authenticate = require('../middleware/auth')
const { createDoctor, updateDoctor, doctorId } = require('../validators/doctorValidators')

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', doctorId, validate, controller.getById)
router.post('/', authenticate, createDoctor, validate, controller.create)
router.put('/:id', authenticate, updateDoctor, validate, controller.update)
router.delete('/:id', authenticate, doctorId, validate, controller.remove)

module.exports = router
