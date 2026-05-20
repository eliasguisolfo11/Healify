const { Router } = require('express')
const controller = require('../controllers/patientController')
const authenticate = require('../middleware/auth')

const router = Router()

router.get('/', authenticate, controller.getAll)
router.get('/:id', authenticate, controller.getById)
router.put('/:id', authenticate, controller.update)

module.exports = router
