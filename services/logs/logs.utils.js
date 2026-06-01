const pino = require("pino");
const logger = pino();
const LogDB = require("../../models/log.model");

// Middleware to log requests and save them to the database
const requestLogger = (req, res, next) => {
  // Wait for the response to finish before logging the final status
  res.on("finish", () => {
    const logData = {
      method: req.method,
      endpoint: req.originalUrl,
      status_code: res.statusCode,
      message: `Request processed for ${req.originalUrl}`,
    };

    logger.info(logData);

    // Attempt to save the log entry, log an error if DB operation fails
    LogDB.create(logData).catch((error) => {
      logger.error("Failed to save log to MongoDB", error);
    });
  });

  next();
};

module.exports = requestLogger;