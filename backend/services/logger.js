import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const { combine, timestamp, printf, colorize, json } = winston.format;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const myFormat = printf(({ level, message, timestamp: ts }) => `${ts} ${level}: ${message}`);

// Ensure logs directory exists (you may want to create it manually)
const logsDir = path.join(__dirname, '..', 'logs');

const transports = [
  new winston.transports.Console({ 
    format: combine(colorize(), timestamp(), myFormat) 
  })
];

// Add file rotation in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new DailyRotateFile({
      filename: path.join(logsDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxDays: '14d',
      format: combine(timestamp(), json())
    }),
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '50m',
      maxDays: '14d',
      format: combine(timestamp(), json())
    })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), myFormat),
  transports
});

export { logger };
