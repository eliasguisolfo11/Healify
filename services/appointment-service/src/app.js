require('dotenv').config()
const express = require('express')
const cors = require('cors')
const sequelize = require('./config/database')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')
require('./domain')

const app = express()
const PORT = process.env.PORT || 4003

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.use(errorHandler)

async function start() {
  try {
    await sequelize.sync()
    console.log('appointment-service: DB synced')
    app.listen(PORT, () => {
      console.log(`appointment-service running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start appointment-service:', err)
    process.exit(1)
  }
}

start()

module.exports = app
