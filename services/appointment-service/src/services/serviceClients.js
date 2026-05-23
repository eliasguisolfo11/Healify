const axios = require('axios')

const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://localhost:4001'
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://localhost:4002'

const doctorClient = axios.create({ baseURL: DOCTOR_SERVICE_URL, timeout: 5000 })
const patientClient = axios.create({ baseURL: PATIENT_SERVICE_URL, timeout: 5000 })

const circuitState = {
  doctor: { failures: 0, openUntil: 0 },
  patient: { failures: 0, openUntil: 0 },
}

const MAX_FAILURES = 3
const COOLDOWN_MS = 30000

function isCircuitOpen(service) {
  const state = circuitState[service]
  if (state.failures >= MAX_FAILURES) {
    if (Date.now() < state.openUntil) {
      return true
    }
    state.failures = 0
  }
  return false
}

function recordFailure(service) {
  const state = circuitState[service]
  state.failures++
  if (state.failures >= MAX_FAILURES) {
    state.openUntil = Date.now() + COOLDOWN_MS
    console.error(`[circuit-breaker] ${service}-service: opened for ${COOLDOWN_MS}ms`)
  }
}

function recordSuccess(service) {
  circuitState[service].failures = 0
}

async function withRetry(service, fn, label) {
  if (isCircuitOpen(service)) {
    throw Object.assign(new Error(`${service}-service is unavailable (circuit open)`), {
      statusCode: 503,
      code: 'SERVICE_UNAVAILABLE',
    })
  }

  const delays = [100, 200, 400]
  let lastError

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    const start = Date.now()
    try {
      const result = await fn()
      const elapsed = Date.now() - start
      console.log(`[service-client] ${label} succeeded in ${elapsed}ms (attempt ${attempt + 1})`)
      recordSuccess(service)
      return result
    } catch (err) {
      lastError = err
      const elapsed = Date.now() - start
      console.error(`[service-client] ${label} failed in ${elapsed}ms (attempt ${attempt + 1}): ${err.message}`)

      if (err.response && err.response.status < 500) {
        throw err
      }

      if (attempt < delays.length) {
        await new Promise(r => setTimeout(r, delays[attempt]))
      }
    }
  }

  recordFailure(service)
  throw Object.assign(new Error(`${label} failed after ${delays.length + 1} attempts: ${lastError.message}`), {
    statusCode: 503,
    code: 'SERVICE_UNAVAILABLE',
  })
}

async function getDoctor(id) {
  return withRetry('doctor', async () => {
    const { data } = await doctorClient.get(`/api/doctors/${id}`)
    return data.doctor
  }, `getDoctor(${id})`)
}

async function getPatient(id, token) {
  return withRetry('patient', async () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const { data } = await patientClient.get(`/api/patients/${id}`, { headers })
    return data.patient
  }, `getPatient(${id})`)
}

async function getDoctorSlots(doctorId, date) {
  return withRetry('doctor', async () => {
    const { data } = await doctorClient.get(`/api/schedules/${doctorId}/slots`, { params: { date } })
    return data.slots
  }, `getDoctorSlots(${doctorId}, ${date})`)
}

module.exports = { getDoctor, getPatient, getDoctorSlots }
