const mongoose = require('mongoose')
const logger = require('../helpers/logger')
const { DB } = require('../config')

// Build the options
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

logger.debug(DB)

// Create the database connection
mongoose
  .connect(DB, options)
  .then(() => {
    logger.info('Mongoose connection done')
  })
  .catch((e) => {
    logger.info('Mongoose connection error')
    logger.error(e)
  });

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info('Mongoose connection disconnected through app termination')
    process.exit(0)
  })
})