function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
  }

  if (err.response) {
    return res.status(err.response.status).json({ error: err.response.data.error || 'External service error' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}

module.exports = errorHandler
