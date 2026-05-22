const { Router } = require('express')
const controller = require('../controllers/appointmentController')
const validate = require('../middleware/validate')
const authenticate = require('../middleware/auth')
const { createAppointment, cancelAppointment, appointmentId } = require('../validators/appointmentValidators')

const router = Router()

router.get('/', authenticate, controller.getAll)
router.get('/patient/:patientId', authenticate, controller.getByPatient)
router.get('/doctor/:doctorId', authenticate, controller.getByDoctor)
router.get('/:id', authenticate, appointmentId, validate, controller.getById)
router.post('/', authenticate, createAppointment, validate, controller.create)
router.put('/:id/cancel', authenticate, cancelAppointment, validate, controller.cancel)
router.put('/:id/confirm', authenticate, appointmentId, validate, controller.confirm)

module.exports = router
