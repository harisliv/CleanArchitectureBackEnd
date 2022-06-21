const { createLogger, transports, format } = require('winston');

const winstonLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [new transports.Console()]
});

if (process.env.NODE_ENV !== 'production') {
  winstonLogger.format = format.combine(
    format.colorize(),
    format.errors({ stack: true }),
    format.splat(),
    format.simple()
  );
}

module.exports = winstonLogger;
