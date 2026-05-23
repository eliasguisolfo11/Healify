const appointmentService = require('../services/appointmentService')
const AppError = require('../middleware/AppError')

async function getAll(req, res, next) {
  try {
    const { doctorId, date, status } = req.query
    const limit = parseInt(req.query.limit) || 20
    const offset = parseInt(req.query.offset) || 0
    const { rows: appointments, count: total } = await appointmentService.findAll({ patientId: req.patientId, doctorId, date, status, limit, offset })
    res.json({ appointments, total, limit, offset })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const appointment = await appointmentService.findById(req.params.id, req.patientId)
    if (!appointment) throw new AppError('Appointment not found', 404, 'NOT_FOUND')
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function create(req, res, next) {
  try {
    if (req.patientId !== req.body.patientId) {
      throw new AppError('You can only create appointments for yourself', 403, 'FORBIDDEN')
    }
    const appointment = await appointmentService.create(req.body, req.token)
    res.status(201).json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function cancel(req, res, next) {
  try {
    const appointment = await appointmentService.cancel(req.params.id, req.patientId, req.body.reason)
    if (!appointment) throw new AppError('Appointment not found', 404, 'NOT_FOUND')
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function confirm(req, res, next) {
  try {
    const appointment = await appointmentService.confirm(req.params.id, req.patientId)
    if (!appointment) throw new AppError('Appointment not found', 404, 'NOT_FOUND')
    res.json({ appointment })
  } catch (err) {
    next(err)
  }
}

async function getByPatient(req, res, next) {
  try {
    if (req.patientId !== req.params.patientId) {
      throw new AppError('You can only view your own appointments', 403, 'FORBIDDEN')
    }
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
