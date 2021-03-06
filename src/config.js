const ENVIRONMENT = process.env.NODE_ENV
const PORT = process.env.PORT

const DB = process.env.MONGO_DB
const CACHE_DB = process.env.REDIS_DB

const JWT = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
}

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL

module.exports = {
    ENVIRONMENT,
    PORT,
    DB,
    CACHE_DB,
    JWT,
    PRODUCT_SERVICE_URL
}