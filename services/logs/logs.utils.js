const pino = require("pino");
const logger = pino();
const LogDB = require("../../models/log.model");

const requestLogger = (req, res, next) => {
  console.log("entered request logger");

  res.on("finish", async () => {
    const logData = {
      method: req.method,
      endpoint: req.originalUrl,
      status_code: res.statusCode,
      message: `${req.method} ${req.originalUrl} ${res.statusCode}`,
    };

    console.log("trying to save log:", logData);

    try {
      const savedLog = await LogDB.create(logData);
      console.log("log saved:", savedLog._id);
      logger.info(logData);
    } catch (error) {
      console.error("Failed to save log to MongoDB:", error.message);
      console.error(error);
    }
  });

  next();
};

module.exports = requestLogger;