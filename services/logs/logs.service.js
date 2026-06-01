const Log = require('../../models/log.model');

async function getAllLogs() {
    const logs = await Log.find();
    return logs;
}

module.exports = {
    getAllLogs
};