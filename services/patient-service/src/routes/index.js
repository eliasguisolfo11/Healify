const { Router } = require('express')
const authRoutes = require('./authRoutes')
const patientRoutes = require('./patientRoutes')

const router = Router()

router.use('/auth', authRoutes)
router.use('/patients', patientRoutes)

module.exports = router
