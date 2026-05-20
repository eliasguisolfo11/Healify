const { Schedule, Exception } = require('../domain')
const { Op } = require('sequelize')

async function findByDoctor(doctorId) {
  return Schedule.findAll({ where: { doctorId } })
}

async function create(data) {
  return Schedule.create(data)
}

async function getSlots(doctorId, date) {
  const dayOfWeek = new Date(date).getDay()

  const schedules = await Schedule.findAll({
    where: { doctorId, dayOfWeek },
    order: [['startTime', 'ASC']],
  })

  const exceptions = await Exception.findAll({
    where: { doctorId, date },
  })

  const isExceptional = exceptions.some(e => !e.isAvailable)
  if (isExceptional) return []

  const exceptionOverride = exceptions.find(e => e.isAvailable)

  let slots = []

  for (const schedule of schedules) {
    const duration = schedule.slotDuration
    const [startH, startM] = schedule.startTime.split(':').map(Number)
    const [endH, endM] = schedule.endTime.split(':').map(Number)

    let current = startH * 60 + startM
    const end = endH * 60 + endM

    while (current + duration <= end) {
      const h = String(Math.floor(current / 60)).padStart(2, '0')
      const m = String(current % 60).padStart(2, '0')
      slots.push({ time: `${h}:${m}` })
      current += duration
    }
  }

  return slots
}

module.exports = { findByDoctor, create, getSlots }
