const { Doctor, Specialty } = require('../domain')

async function findAll() {
  return Doctor.findAll({ include: [{ model: Specialty, as: 'specialty' }] })
}

async function findById(id) {
  return Doctor.findByPk(id, { include: [{ model: Specialty, as: 'specialty' }] })
}

async function create(data) {
  return Doctor.create(data)
}

async function update(id, data) {
  const doctor = await Doctor.findByPk(id)
  if (!doctor) return null
  return doctor.update(data)
}

async function remove(id) {
  const doctor = await Doctor.findByPk(id)
  if (!doctor) return false
  await doctor.destroy()
  return true
}

module.exports = { findAll, findById, create, update, remove }
