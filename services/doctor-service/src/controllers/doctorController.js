const doctorService = require('../services/doctorService')

async function getAll(req, res, next) {
  try {
    const doctors = await doctorService.findAll()
    res.json({ doctors })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const doctor = await doctorService.findById(req.params.id)
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
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
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
    res.json({ doctor })
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await doctorService.remove(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Doctor not found' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove }
