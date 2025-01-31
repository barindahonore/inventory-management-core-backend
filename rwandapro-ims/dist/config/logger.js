"use strict";
// // import winston from "winston";
// const winston = require('winston');
// import { env } from "./env";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const winston_1 = __importDefault(require("winston"));
const env_1 = require("./env");
// Create redaction filter format
const redactSensitive = winston_1.default.format((info) => {
    const redactKeys = ["password", "token", "jwt", "authorization"];
    redactKeys.forEach((key) => {
        if (info[key]) {
            info[key] = "**REDACTED**";
        }
    });
    return info;
});
const logFormat = winston_1.default.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] ${message} `;
    if (metadata && Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
    }
    return msg;
});
const logger = winston_1.default.createLogger({
    level: env_1.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), redactSensitive(), // Add redaction here
    env_1.env.NODE_ENV === "development" ? winston_1.default.format.colorize() : winston_1.default.format.json(), logFormat),
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
            handleRejections: true
        })
    ],
    exitOnError: false
});
exports.default = logger;
