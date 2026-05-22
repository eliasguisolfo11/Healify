const patientService = require('../services/patientService')

async function getAll(req, res, next) {
  try {
    const patients = await patientService.findAll()
    res.json({ patients })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    if (req.patientId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const patient = await patientService.findById(req.params.id)
    if (!patient) return res.status(404).json({ error: 'Patient not found' })
    res.json({ patient })
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    if (req.patientId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const patient = await patientService.update(req.params.id, req.body)
    if (!patient) return res.status(404).json({ error: 'Patient not found' })
    res.json({ patient })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, update }
