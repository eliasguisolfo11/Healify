const scheduleService = require('../services/scheduleService')
const AppError = require('../middleware/AppError')

async function getByDoctor(req, res, next) {
  try {
    const schedules = await scheduleService.findByDoctor(req.params.id)
    res.json({ schedules })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const schedule = await scheduleService.create(req.body)
    res.status(201).json({ schedule })
  } catch (err) {
    next(err)
  }
}

async function getSlots(req, res, next) {
  try {
    const { date } = req.query
    if (!date) throw new AppError('date query param is required', 400, 'VALIDATION_ERROR')
    const slots = await scheduleService.getSlots(req.params.id, date)
    res.json({ slots })
  } catch (err) {
    next(err)
  }
}

module.exports = { getByDoctor, create, getSlots }
