const { Router } = require('express')
const controller = require('../controllers/appointmentController')
const validate = require('../middleware/validate')
const { createAppointment, cancelAppointment, appointmentId } = require('../validators/appointmentValidators')

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', appointmentId, validate, controller.getById)
router.post('/', createAppointment, validate, controller.create)
router.put('/:id/cancel', cancelAppointment, validate, controller.cancel)
router.put('/:id/confirm', appointmentId, validate, controller.confirm)
router.get('/patient/:patientId', controller.getByPatient)
router.get('/doctor/:doctorId', controller.getByDoctor)

module.exports = router
