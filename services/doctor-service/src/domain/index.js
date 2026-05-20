const Doctor = require('./entities/Doctor')
const Specialty = require('./entities/Specialty')
const Schedule = require('./entities/Schedule')
const Exception = require('./entities/Exception')

Doctor.belongsTo(Specialty, { foreignKey: 'specialtyId', as: 'specialty' })
Specialty.hasMany(Doctor, { foreignKey: 'specialtyId', as: 'doctors' })

Doctor.hasMany(Schedule, { foreignKey: 'doctorId', as: 'schedules' })
Schedule.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' })

Doctor.hasMany(Exception, { foreignKey: 'doctorId', as: 'exceptions' })
Exception.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' })

module.exports = { Doctor, Specialty, Schedule, Exception }
