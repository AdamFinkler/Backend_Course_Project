require('dotenv').config();

const express = require('express');
const connectDB = require('../../config/db');
const aboutRouter = require('./about.router');

const app = express();

app.use(express.json());

app.use('/api', aboutRouter);

app.get('/', (req, res) => {
  res.json({
    message: 'About service is running'
  });
});

const PORT = process.env.ABOUT_PORT || 3004;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`About service running on port ${PORT}`);
  });
}

startServer();