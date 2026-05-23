const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Patient } = require('../domain')
const AppError = require('../middleware/AppError')
const SALT_ROUNDS = 10

async function register({ email, password, name, lastName, phone }) {
  const existing = await Patient.findOne({ where: { email } })
  if (existing) { throw new AppError('Email already registered', 409, 'CONFLICT') }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const patient = await Patient.create({ email, passwordHash, name, lastName, phone })

  const token = jwt.sign(
    { patientId: patient.id, role: 'patient' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

  return { token, patient: { id: patient.id, email: patient.email, name: patient.name, lastName: patient.lastName, phone: patient.phone } }
}

async function login({ email, password }) {
  const patient = await Patient.findOne({ where: { email } })
  if (!patient) {
    throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED')
  }

  const valid = await bcrypt.compare(password, patient.passwordHash)
  if (!valid) {
    throw new AppError('Invalid email or password', 401, 'UNAUTHORIZED')
  }

  const token = jwt.sign(
    { patientId: patient.id, role: 'patient' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

  return { token, patient: { id: patient.id, email: patient.email, name: patient.name, lastName: patient.lastName, phone: patient.phone } }
}

module.exports = { register, login }
