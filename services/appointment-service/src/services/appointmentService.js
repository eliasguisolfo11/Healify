const { Appointment } = require('../domain')
const { getDoctor, getPatient, getDoctorSlots } = require('./serviceClients')
const { Op } = require('sequelize')
const { APPOINTMENT_STATUS } = require('../constants')
const AppError = require('../middleware/AppError')

async function findAll({ patientId, doctorId, date, status, limit = 20, offset = 0 } = {}) {
  const where = { patientId }
  if (doctorId) where.doctorId = doctorId
  if (date) where.date = date
  if (status) where.status = status
  return Appointment.findAndCountAll({
    where,
    order: [['date', 'ASC'], ['time', 'ASC']],
    limit: Math.min(limit, 100),
    offset,
  })
}

async function findById(id, patientId) {
  const appointment = await Appointment.findByPk(id)
  if (!appointment) return null
  if (appointment.patientId !== patientId) return null
  return appointment
}

async function findByPatient(patientId) {
  return Appointment.findAll({ where: { patientId }, order: [['date', 'DESC']] })
}

async function findByDoctor(doctorId) {
  return Appointment.findAll({ where: { doctorId }, order: [['date', 'DESC']] })
}

async function create({ doctorId, patientId, date, time }, token) {
  const doctor = await getDoctor(doctorId)
  if (!doctor) {
    throw new AppError('Doctor not found', 404, 'NOT_FOUND')
  }

  const patient = await getPatient(patientId, token)
  if (!patient) {
    throw new AppError('Patient not found', 404, 'NOT_FOUND')
  }

  const slots = await getDoctorSlots(doctorId, date)
  const slotAvailable = slots.some(s => s.time.startsWith(time))
  if (!slotAvailable) {
    throw new AppError('Selected time is not available', 400, 'VALIDATION_ERROR')
  }

  const conflict = await Appointment.findOne({
    where: { doctorId, date, time, status: { [Op.not]: APPOINTMENT_STATUS.CANCELLED } },
  })
  if (conflict) {
    throw new AppError('Time slot already booked', 409, 'CONFLICT')
  }

  return Appointment.create({ doctorId, patientId, date, time, status: APPOINTMENT_STATUS.PENDING })
}

async function cancel(id, patientId, reason) {
  const appointment = await Appointment.findByPk(id)
  if (!appointment) return null
  if (appointment.patientId !== patientId) return null
  if (appointment.status === APPOINTMENT_STATUS.CANCELLED || appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new AppError(`Cannot cancel appointment with status ${appointment.status}`, 400, 'VALIDATION_ERROR')
  }
  return appointment.update({ status: APPOINTMENT_STATUS.CANCELLED, reason: reason || null })
}

async function confirm(id, patientId) {
  const appointment = await Appointment.findByPk(id)
  if (!appointment) return null
  if (appointment.patientId !== patientId) return null
  return appointment.update({ status: APPOINTMENT_STATUS.CONFIRMED })
}

module.exports = { findAll, findById, findByPatient, findByDoctor, create, cancel, confirm }
