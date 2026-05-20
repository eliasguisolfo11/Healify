const { Router } = require('express')
const controller = require('../controllers/specialtyController')

const router = Router()

router.get('/', controller.getAll)
router.post('/', controller.create)

module.exports = router
