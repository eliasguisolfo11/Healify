const patientService = require('../services/patientService')
const AppError = require('../middleware/AppError')

async function getAll(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0
    const { rows: patients, count: total } = await patientService.findAll({ limit, offset })
    res.json({ patients, total, limit, offset })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    if (req.patientId !== req.params.id) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN')
    }
    const patient = await patientService.findById(req.params.id)
    if (!patient) throw new AppError('Patient not found', 404, 'NOT_FOUND')
    res.json({ patient })
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    if (req.patientId !== req.params.id) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN')
    }
    const patient = await patientService.update(req.params.id, req.body)
    if (!patient) throw new AppError('Patient not found', 404, 'NOT_FOUND')
    res.json({ patient })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, update }
