function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key']
  if (adminKey && process.env.ADMIN_API_KEY && adminKey === process.env.ADMIN_API_KEY) {
    req.role = 'admin'
    return next()
  }

  if (req.role !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
      code: 'FORBIDDEN',
      statusCode: 403,
    })
  }

  next()
}

module.exports = requireAdmin
