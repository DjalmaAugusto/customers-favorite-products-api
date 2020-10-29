const express = require("express")
const health = require('express-healthcheck')

const authRoutes = require('./auth/auth')

const router = express.Router()

router.use('/health', health())
router.use('/auth', authRoutes)

module.exports = router