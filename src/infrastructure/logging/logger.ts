import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "info", // You can change to 'debug' in development
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    // You can add file transports here if needed
    // new winston.transports.File({ filename: 'combined.log' })
  ],
});
