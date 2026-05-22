const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Patient } = require('../domain')

const SALT_ROUNDS = 10

async function register({ email, password, name, lastName, phone }) {
  const existing = await Patient.findOne({ where: { email } })
  if (existing) {
    const error = new Error('Email already registered')
    error.status = 409
    throw error
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const patient = await Patient.create({ email, passwordHash, name, lastName, phone })

  const token = jwt.sign(
    { patientId: patient.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

  return { token, patient: { id: patient.id, email: patient.email, name: patient.name, lastName: patient.lastName, phone: patient.phone } }
}

async function login({ email, password }) {
  const patient = await Patient.findOne({ where: { email } })
  if (!patient) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  const valid = await bcrypt.compare(password, patient.passwordHash)
  if (!valid) {
    const error = new Error('Invalid email or password')
    error.status = 401
    throw error
  }

  const token = jwt.sign(
    { patientId: patient.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  )

  return { token, patient: { id: patient.id, email: patient.email, name: patient.name, lastName: patient.lastName, phone: patient.phone } }
}

module.exports = { register, login }
