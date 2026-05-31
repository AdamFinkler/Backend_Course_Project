const pino = require("pino");
const logger = pino();
const LogDB = require("../../models/log.model");

const requestLogger = (req, res, next) => {
  res.on("finish", async () => {
    const logData = {
      method: req.method,
      endpoint: req.originalUrl,
      status_code: res.statusCode,
      message: `Request processed for ${req.originalUrl}`,
    };

    // תיעוד בקונסולה עם Pino
    logger.info(logData);

    // שמירה למסד הנתונים
    try {
      await LogDB.create(logData);
    } catch (error) {
      logger.error("Failed to save log to MongoDB", error);
    }
  });

  next();
};

module.exports = requestLogger;
