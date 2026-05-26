require('dotenv').config();

const express = require('express');
const pino = require('pino');
const connectDB = require('../../config/db');
const Log = require('../../models/log.model');
const costRouter = require('./cost.router');

const logger = pino();
const app = express();

app.use(express.json());

// log every request to the console and save it to the database
app.use((req, res, next) => {
  res.on('finish', () => {
    const message = `${req.method} ${req.originalUrl} ${res.statusCode}`;
    logger.info(message);

    Log.create({
      method: req.method,
      endpoint: req.originalUrl,
      status_code: res.statusCode,
      message
    }).catch((err) => logger.error(err, 'Failed to save log'));
  });

  next();
});

app.use('/api', costRouter);

// health check
app.get('/', (req, res) => {
  res.json({ message: 'Costs service is running' });
});

const PORT = process.env.COSTS_PORT || 3002;

// connect to DB and start the server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Costs service running on port ${PORT}`);
  });
}

// only start when running directly, not when imported by tests
if (require.main === module) {
  startServer();
}

module.exports = app;
