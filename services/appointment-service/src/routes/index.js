const { Router } = require('express')
const appointmentRoutes = require('./appointmentRoutes')

const router = Router()

router.use('/appointments', appointmentRoutes)

module.exports = router
