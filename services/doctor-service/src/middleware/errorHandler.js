function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ error: 'Referenced record not found' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}

module.exports = errorHandler
