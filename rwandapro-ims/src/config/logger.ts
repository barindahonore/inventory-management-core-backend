// // import winston from "winston";
// const winston = require('winston');
// import { env } from "./env";

// const { combine, timestamp, printf, colorize } = winston.format;

// const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
//   let msg = `${timestamp} [${level}] ${message} `;
//   if (metadata && Object.keys(metadata).length > 0) {
//     msg += JSON.stringify(metadata);
//   }
//   return msg;
// });

// const logger = winston.createLogger({
//   level: env.NODE_ENV === "production" ? "info" : "debug",
//   format: combine(
//     timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//     env.NODE_ENV === "development" ? colorize() : winston.format.json(),
//     logFormat
//   ),
//   transports: [
//     new winston.transports.Console({
//       handleExceptions: true,
//       handleRejections: true
//     })
//   ],
//   exitOnError: false
// });

// // For security: Redact sensitive fields
// logger.addRedactKeys(["password", "token", "jwt", "authorization"]);

// export default logger;


import winston from "winston";
import { env } from "./env";

// Create redaction filter format
const redactSensitive = winston.format((info) => {
  const redactKeys = ["password", "token", "jwt", "authorization"];
  redactKeys.forEach((key) => {
    if (info[key]) {
      info[key] = "**REDACTED**";
    }
  });
  return info;
});

const logFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] ${message} `;
  if (metadata && Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    redactSensitive(), // Add redaction here
    env.NODE_ENV === "development" ? winston.format.colorize() : winston.format.json(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
});

export default logger;
