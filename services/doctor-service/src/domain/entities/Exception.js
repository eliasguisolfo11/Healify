const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Exception = sequelize.define('Exception', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_available',
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true,
  },
})

module.exports = Exception
