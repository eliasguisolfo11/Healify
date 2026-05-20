const { Router } = require('express')
const controller = require('../controllers/doctorController')
const validate = require('../middleware/validate')
const { createDoctor, updateDoctor, doctorId } = require('../validators/doctorValidators')

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', doctorId, validate, controller.getById)
router.post('/', createDoctor, validate, controller.create)
router.put('/:id', updateDoctor, validate, controller.update)
router.delete('/:id', doctorId, validate, controller.remove)

module.exports = router
