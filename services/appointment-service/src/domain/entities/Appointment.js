const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')
const { APPOINTMENT_STATUS } = require('../../constants')

const Appointment = sequelize.define('Appointment', {
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
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'patient_id',
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(Object.values(APPOINTMENT_STATUS)),
    defaultValue: APPOINTMENT_STATUS.PENDING,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  indexes: [
    { fields: ['doctor_id'] },
    { fields: ['patient_id'] },
    { fields: ['status'] },
  ],
})

module.exports = Appointment
