const dns = require("dns");
const mongoose = require("mongoose");

// On some Windows networks the system DNS (often IPv6) refuses Node SRV lookups
// (querySrv ECONNREFUSED) while nslookup still works. Public DNS fixes mongodb+srv.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.log("Database connection error:");
    console.log(error.message);

    process.exit(1);
  }
}

module.exports = connectDB;