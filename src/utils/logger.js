const winston = require("winston");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign(info, { message: info.message, stack: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.printf(
                ({ timestamp, level, message, stack }) =>
                  `${timestamp} | ${level}: ${message} ${
                    stack ? "\n" + stack : ""
                  }`
              )
            ),
    }),
  ],
});

module.exports = logger;
