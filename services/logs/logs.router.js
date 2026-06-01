const express = require('express');
const router = express.Router();
const logsService = require('./logs.service');

// Handles GET requests to fetch all system logs
router.get('/', async (req, res) => {
    try {
        const logs = await logsService.getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        // Must return 'id' and 'message' strictly per project requirements
        res.status(500).json({
            id: "SERVER_ERROR",
            message: error.message
        });
    }
});

module.exports = router;