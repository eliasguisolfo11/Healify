const { Specialty } = require('../domain')

async function findAll() {
  return Specialty.findAll()
}

async function findById(id) {
  return Specialty.findByPk(id)
}

async function create(data) {
  return Specialty.create(data)
}

module.exports = { findAll, findById, create }
