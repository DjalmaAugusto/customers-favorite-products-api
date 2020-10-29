const express = require('express')
const bodyParser = require('body-parser')
const routesV1 = require("./routes/v1")

const { logger, errorLogger } = require('./middleware/requestLogger')

// Connect database
require('./database/connect')

const app = express()

app.use(bodyParser.json({limit: '5mb'}))

app.use(logger, errorLogger);

// Routes
app.use('/v1', routesV1)

// express error handling
app.use((err, req, res, next) => {
    res.status(500).json(err.message);
})

module.exports = app