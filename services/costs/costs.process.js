require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const costRouter = require('./cost.router');

// Import the custom request logger middleware
const requestLogger = require('../logs/logs.utils');

const app = express();

// Parse incoming JSON requests and apply the global request logger
app.use(express.json());
app.use(requestLogger);

// Mount the costs router to handle '/api' requests
app.use('/api', costRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Costs service is running' });
});

const PORT = process.env.COSTS_PORT || 3002;

// Connect to the database and start the server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Costs service running on port ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
