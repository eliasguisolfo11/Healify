const { body } = require('express-validator')

const createSchedule = [
  body('doctorId').isUUID().withMessage('Valid doctor ID is required'),
  body('dayOfWeek').isInt({ min: 0, max: 6 }).withMessage('Day of week must be 0-6'),
  body('startTime').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('Start time must be HH:mm or HH:mm:ss'),
  body('endTime').matches(/^\d{2}:\d{2}(:\d{2})?$/).withMessage('End time must be HH:mm or HH:mm:ss'),
  body('slotDuration').optional().isInt({ min: 5 }).withMessage('Slot duration must be at least 5 minutes'),
]

module.exports = { createSchedule }
