const { Appointment } = require('../domain')
const { getDoctor, getPatient, getDoctorSlots } = require('./serviceClients')
const { Op } = require('sequelize')

async function findAll({ doctorId, date, status } = {}) {
  const where = {}
  if (doctorId) where.doctorId = doctorId
  if (date) where.date = date
  if (status) where.status = status
  return Appointment.findAll({ where, order: [['date', 'ASC'], ['time', 'ASC']] })
}

async function findById(id) {
  return Appointment.findByPk(id)
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
    const error = new Error('Doctor not found')
    error.status = 404
    throw error
  }

  const patient = await getPatient(patientId, token)
  if (!patient) {
    const error = new Error('Patient not found')
    error.status = 404
    throw error
  }

  const slots = await getDoctorSlots(doctorId, date)
  const slotAvailable = slots.some(s => s.time.startsWith(time))
  if (!slotAvailable) {
    const error = new Error('Selected time is not available')
    error.status = 400
    throw error
  }

  const conflict = await Appointment.findOne({
    where: { doctorId, date, time, status: { [Op.not]: 'cancelled' } },
  })
  if (conflict) {
    const error = new Error('Time slot already booked')
    error.status = 409
    throw error
  }

  return Appointment.create({ doctorId, patientId, date, time, status: 'pending' })
}

async function cancel(id, reason) {
  const appointment = await Appointment.findByPk(id)
  if (!appointment) return null
  if (appointment.status === 'cancelled' || appointment.status === 'completed') {
    const error = new Error(`Cannot cancel appointment with status ${appointment.status}`)
    error.status = 400
    throw error
  }
  return appointment.update({ status: 'cancelled', reason: reason || null })
}

async function confirm(id) {
  const appointment = await Appointment.findByPk(id)
  if (!appointment) return null
  return appointment.update({ status: 'confirmed' })
}

module.exports = { findAll, findById, findByPatient, findByDoctor, create, cancel, confirm }
