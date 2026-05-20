const appointmentService = require('../services/appointmentService')

async function getAll(req, res, next) {
  try {
    const { doctorId, date, status } = req.query
    const appointments = await appointmentService.findAll({ doctorId, date, status })
    res.json({ appointments })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await appointmentService.findById(req.params.id)
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    const appointment = await appointmentService.create(req.body)
    res.status(201).json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentService.cancel(req.params.id, req.body.reason)
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function confirm(req, res, next) {
  try {
    const appointment = await appointmentService.confirm(req.params.id)
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function getByPatient(req, res, next) {
  try {
    const appointments = await appointmentService.findByPatient(req.params.patientId)
    res.json({ appointments })
  } catch (err) {
    next(err)
  }
}

async function getByDoctor(req, res, next) {
  try {
    const appointments = await appointmentService.findByDoctor(req.params.doctorId)
    res.json({ appointments })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, cancel, confirm, getByPatient, getByDoctor }
