const ENVIRONMENT = process.env.NODE_ENV
const PORT = process.env.PORT
const DB = process.env.MONGO_DB
const CACHE_DB = process.env.REDIS_DB

module.exports = {
    ENVIRONMENT,
    PORT,
    DB,
    CACHE_DB
}