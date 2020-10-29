const { PORT } = require('./config')
const app = require('./app')
const logger = require('./helpers/logger')

const server = app
  .listen(PORT, () => {
    logger.info(`server running on port : ${PORT}`)
  })
  .on('error', (e) => logger.error(e))

module.exports = server