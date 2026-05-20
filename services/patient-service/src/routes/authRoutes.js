const { Router } = require('express')
const controller = require('../controllers/authController')
const validate = require('../middleware/validate')
const { register, login } = require('../validators/authValidators')

const router = Router()

router.post('/register', register, validate, controller.register)
router.post('/login', login, validate, controller.login)

module.exports = router
