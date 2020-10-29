const express = require("express")
const health = require('express-healthcheck')

const router = express.Router()

router.use('/health', health())

module.exports = router