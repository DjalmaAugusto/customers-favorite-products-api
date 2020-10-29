const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const dir = path.resolve('logs')

// create a rotating write stream
const stream = rfs.createStream(`access.log`, {
    size: "5M", // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(dir, "/access")
})
const errorStream = rfs.createStream(`accessWithError.log`, {
    size: "5M", // rotate every 5 MegaBytes written
    interval: '1d', // rotate daily
    compress: "gzip", // compress rotated files
    path: path.join(dir, "/access")
})

const logger = morgan('common', { stream } )
const errorLogger = morgan('short', { stream: errorStream, skip: (req, res) => { return res.statusCode < 400 } })

module.exports = {
    logger,
    errorLogger
}