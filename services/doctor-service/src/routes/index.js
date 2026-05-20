const { Router } = require('express')
const doctorRoutes = require('./doctorRoutes')
const specialtyRoutes = require('./specialtyRoutes')
const scheduleRoutes = require('./scheduleRoutes')

const router = Router()

router.use('/doctors', doctorRoutes)
router.use('/specialties', specialtyRoutes)
router.use('/schedules', scheduleRoutes)

module.exports = router
