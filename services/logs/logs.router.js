const express = require('express');
const router = express.Router();
const logsService = require('./logs.service');

// שים לב שפה הכתובת היא רק '/', כי ב-process אנחנו נגדיר שהראוטר הזה אחראי על /api/logs
router.get('/', async (req, res) => {
    try {
        const logs = await logsService.getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch logs",
            details: error.message
        });
    }
});

module.exports = router;