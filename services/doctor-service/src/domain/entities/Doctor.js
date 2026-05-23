const { DataTypes } = require('sequelize')
const sequelize = require('../../config/database')

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  specialtyId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'specialty_id',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  indexes: [
    { fields: ['email'] },
    { fields: ['specialty_id'] },
  ],
})

module.exports = Doctor
