const doctorService = require('../services/doctorService')
const AppError = require('../middleware/AppError')

async function getAll(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100)
    const offset = parseInt(req.query.offset, 10) || 0
    const { rows: doctors, count: total } = await doctorService.findAll({ limit, offset })
    res.json({ doctors, total, limit, offset })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const doctor = await doctorService.findById(req.params.id)
    if (!doctor) throw new AppError('Doctor not found', 404, 'NOT_FOUND')
    res.json({ doctor })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const doctor = await doctorService.create(req.body)
    res.status(201).json({ doctor })
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const doctor = await doctorService.update(req.params.id, req.body)
    if (!doctor) throw new AppError('Doctor not found', 404, 'NOT_FOUND')
    res.json({ doctor })
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await doctorService.remove(req.params.id)
    if (!deleted) throw new AppError('Doctor not found', 404, 'NOT_FOUND')
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove }
