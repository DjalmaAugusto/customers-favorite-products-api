const express = require("express")
const health = require('express-healthcheck')

const authRoutes = require('./auth/auth')
const { Customer: customerRoutes, CustomerProduct: customerProductRoutes } = require('./customer')

const authMiddleware = require('../../middleware/auth')

const router = express.Router()

router.use('/health', health())
router.use('/auth', authRoutes)
router.use('/customers', authMiddleware, customerRoutes, customerProductRoutes)

module.exports = router