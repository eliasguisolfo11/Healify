require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./config/database')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')
require('./domain')

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is required')
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 4001

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.use(errorHandler)

async function start() {
  try {
    await sequelize.sync()
    console.log('doctor-service: DB synced')
    app.listen(PORT, () => {
      console.log(`doctor-service running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start doctor-service:', err)
    process.exit(1)
  }
}

start()

module.exports = app
