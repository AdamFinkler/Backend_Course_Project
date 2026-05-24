require("dotenv").config();

const express = require("express");
const connectDB = require("../../config/db");

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Users service is running"
  });
});

const PORT = 3001;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Users service running on port ${PORT}`);
  });
}

startServer();