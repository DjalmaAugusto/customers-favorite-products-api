const health = require('express-healthcheck')

const express = require("express")

const router = express.Router()

router.use('/health', health())

module.exports = router