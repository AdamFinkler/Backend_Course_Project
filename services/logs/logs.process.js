require("dotenv").config();
const express = require("express");
const connectDB = require("../../config/db");

// ייבוא הכלים שלנו
const requestLogger = require("./utils.logger");
const logsRouter = require("./logs.router");

const app = express();
app.use(express.json());

// הפעלת כלי הלוגים על כל בקשה שתגיע
app.use(requestLogger);

// חיבור הראוטר שיצרנו לכתובת הספציפית
app.use("/api/logs", logsRouter);

const PORT = process.env.LOGS_PORT || 3003;

async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Logs process is running and listening on port ${PORT}`);
    });
}

startServer();