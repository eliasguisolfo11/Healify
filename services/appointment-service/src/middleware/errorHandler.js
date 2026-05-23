function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: err.errors.map(e => e.message).join(', '),
      code: 'VALIDATION_ERROR',
      statusCode: 400,
    })
  }

  if (err.response) {
    return res.status(err.response.status).json({
      error: err.response.data.error || 'External service error',
      code: err.response.data.code || 'EXTERNAL_SERVICE_ERROR',
      statusCode: err.response.status,
    })
  }

  const statusCode = err.statusCode || err.status || 500
  const code = err.code || (statusCode === 400 ? 'VALIDATION_ERROR' : statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 409 ? 'CONFLICT' : 'INTERNAL_ERROR')

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    code,
    statusCode,
  })
}

module.exports = errorHandler
