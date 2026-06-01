require('dotenv').config();
const express = require('express');
const connectDB = require('../../config/db');
const usersRouter = require('./users.router');

// Import the custom request logger middleware
const requestLogger = require('../logs/logs.utils');

const app = express();

// Parse incoming JSON requests and apply the global request logger
app.use(express.json());
app.use(requestLogger);

// Mount the user's router to handle '/api' requests
app.use('/api', usersRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'Users service is running'
  });
});

const PORT = process.env.USERS_PORT || 3001;

// Connect to the database and start the server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Users service running on port ${PORT}`);
  });
}

startServer();