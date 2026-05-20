const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'doctor_id',
  },
  dayOfWeek: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'day_of_week',
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'start_time',
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'end_time',
  },
  slotDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    field: 'slot_duration',
  },
})

module.exports = Schedule
