require("dotenv").config();
const express = require("express");
const connectDB = require("../../config/db");
const requestLogger = require("./logs.utils");
const logsRouter = require("./logs.router");

const app = express();

// Apply global request logger middleware
app.use(requestLogger);

// Route all '/api/logs' requests to the specific logs router
app.use("/api/logs", logsRouter);

const PORT = process.env.LOGS_PORT || 3003;

// Connects to the database and starts listening for requests
async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Logs process is running and listening on port ${PORT}`);
    });
}

if (require.main === module) {
    startServer();
}

module.exports = app;