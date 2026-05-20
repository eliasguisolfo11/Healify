const { Patient } = require('../domain')

async function findById(id) {
  return Patient.findByPk(id, {
    attributes: { exclude: ['passwordHash'] },
  })
}

async function findAll() {
  return Patient.findAll({
    attributes: { exclude: ['passwordHash'] },
  })
}

async function update(id, data) {
  const patient = await Patient.findByPk(id)
  if (!patient) return null
  return patient.update(data)
}

module.exports = { findById, findAll, update }
