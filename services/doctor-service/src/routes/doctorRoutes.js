const { Router } = require('express')
const controller = require('../controllers/doctorController')
const validate = require('../middleware/validate')
const authenticate = require('../middleware/auth')
const requireAdmin = require('../middleware/requireAdmin')
const { createDoctor, updateDoctor, doctorId } = require('../validators/doctorValidators')

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', doctorId, validate, controller.getById)
router.post('/', authenticate, requireAdmin, createDoctor, validate, controller.create)
router.put('/:id', authenticate, requireAdmin, updateDoctor, validate, controller.update)
router.delete('/:id', authenticate, requireAdmin, doctorId, validate, controller.remove)

module.exports = router
