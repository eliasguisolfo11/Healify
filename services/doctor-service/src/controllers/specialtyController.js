const specialtyService = require('../services/specialtyService')

async function getAll(req, res, next) {
  try {
    const specialties = await specialtyService.findAll()
    res.json({ specialties })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const specialty = await specialtyService.create(req.body)
    res.status(201).json({ specialty })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, create }
