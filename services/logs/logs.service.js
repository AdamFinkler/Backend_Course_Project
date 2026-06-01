const Log = require('../../models/log.model');

// Fetches all log records from the MongoDB collection without filters
async function getAllLogs() {
    const logs = await Log.find();
    return logs;
}

module.exports = {
    getAllLogs
};