const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file')
const path = require('path')
const dir = path.resolve('logs')

const transport = new DailyRotateFile({
    filename: path.join(dir, 'application', '%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
})

const customFormat = printf(({ level, message, timestamp }) => {
    return `${level}: ${timestamp} - ${message}`;
  });

var logger = createLogger({
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [ transport ]
});

module.exports = logger