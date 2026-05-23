const { body, param } = require('express-validator')

const createAppointment = [
  body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
  body('patientId').isUUID().withMessage('Valid patient ID is required'),
  body('date').isISO8601().withMessage('Valid date is required (YYYY-MM-DD)'),
  body('date').custom((date) => {
    const today = new Date().toISOString().split('T')[0]
    if (date < today) {
      throw new Error('Date must be today or later')
    }
    return true
  }),
  body('time').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Valid time is required (HH:mm)'),
]

const cancelAppointment = [
  param('id').isUUID().withMessage('Valid appointment ID is required'),
  body('reason').optional().notEmpty(),
]

const appointmentId = [ param('id').isUUID().withMessage('Valid appointment ID is required') ]

module.exports = { createAppointment, cancelAppointment, appointmentId }
