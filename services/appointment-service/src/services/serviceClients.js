const axios = require('axios')

const DOCTOR_SERVICE_URL = process.env.DOCTOR_SERVICE_URL || 'http://localhost:4001'
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://localhost:4002'

const doctorClient = axios.create({ baseURL: DOCTOR_SERVICE_URL, timeout: 5000 })
const patientClient = axios.create({ baseURL: PATIENT_SERVICE_URL, timeout: 5000 })

async function getDoctor(id) {
  const { data } = await doctorClient.get(`/api/doctors/${id}`)
  return data.doctor
}

async function getPatient(id, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data } = await patientClient.get(`/api/patients/${id}`, { headers })
  return data.patient
}

async function getDoctorSlots(doctorId, date) {
  const { data } = await doctorClient.get(`/api/schedules/${doctorId}/slots`, { params: { date } })
  return data.slots
}

module.exports = { getDoctor, getPatient, getDoctorSlots }
