const redis = require('redis');
const { promisify } = require('util');
const { ENVIRONMENT, CACHE_DB } = require('../../config')
const logger = require('../../helpers/logger')

const connection = {
    [ENVIRONMENT === 'production' ? "host" : "url"]: CACHE_DB
}
const client = redis.createClient(connection)
client.on("ready", () => {
    logger.info('Redis connection done')
})
client.on("error", (e) => {
    logger.info('Redis connection error')
    logger.error(e)
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    client.quit()
    logger.info('Redis default client disconnected through app termination');
    process.exit(0)
})

module.exports = {
    ...client,
    getAsync: promisify(client.get).bind(client),
    setAsync: promisify(client.set).bind(client),
    keysAsync: promisify(client.keys).bind(client)
}