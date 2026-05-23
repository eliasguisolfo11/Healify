const { Router } = require('express')
const controller = require('../controllers/scheduleController')
const validate = require('../middleware/validate')
const authenticate = require('../middleware/auth')
const requireAdmin = require('../middleware/requireAdmin')
const { createSchedule } = require('../validators/scheduleValidators')

const router = Router()

router.get('/:id/slots', controller.getSlots)
router.get('/:id', controller.getByDoctor)
router.post('/', authenticate, requireAdmin, createSchedule, validate, controller.create)

module.exports = router
