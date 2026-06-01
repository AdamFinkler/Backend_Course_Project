require('dotenv').config();

const express = require('express');
const connectDB = require('../../config/db');
const requestLogger = require('../logs/utils.logger');
const costRouter = require('./cost.router');

const app = express();

app.use(express.json());

// log every request to the console and save it to the database
app.use(requestLogger);

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
