import fs from 'fs';
import winston, { format, createLogger } from 'winston';

import config from '../config';

const { combine, timestamp, label, printf, errors, colorize } = format;
const { env, logDir } = config;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/** Creates custom message format for logger
 * @returns {Object}
 */
const customFormat = printf(({ level, message, label, timestamp, stack }) => {
  // eslint-disable-next-line
  if (stack) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${timestamp} [${label}] ${level}: ${message} - ${stack}`;
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `${timestamp} [${label}] ${level}: ${message}`;
});

/** Initialises logger
 * @returns {Object}
 */
const logger = createLogger({
  format: combine(
    label({ label: 'motorway' }),
    errors({ stack: true }),
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    customFormat
  )
});

if (env !== 'production') {
  logger.add(new winston.transports.Console({ level: 'debug' }));
}

if (env !== 'test') {
  logger.add(
    new winston.transports.File({
      filename: 'log/motorway-error.log',
      level: 'error'
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'log/motorway-combined.log',
      level: 'info'
    })
  );
}

export default logger;
