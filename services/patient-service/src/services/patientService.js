const { Patient } = require('../domain')

async function findById(id) {
  return Patient.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
  })
}

async function findAll({ limit = 20, offset = 0 } = {}) {
  return Patient.findAndCountAll({
    attributes: { exclude: ['passwordHash'] },
    limit: Math.min(limit, 100),
    offset,
  })
}

async function update(id, data) {
  const patient = await Patient.findByPk(id)
  if (!patient) return null
  return patient.update(data)
}

module.exports = { findById, findAll, update }
