require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const aboutRouter = require('./about.router');

// Import the custom request logger middleware
const requestLogger = require('../logs/logs.utils');

const app = express();

// Parse incoming JSON requests and apply the global request logger
app.use(express.json());
app.use(requestLogger);

// Mount the about router to handle '/api' requests
app.use('/api', aboutRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'About service is running'
  });
});

const PORT = process.env.ABOUT_PORT || 3004;

// Connect to the database and start the server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`About service running on port ${PORT}`);
  });
}

startServer();