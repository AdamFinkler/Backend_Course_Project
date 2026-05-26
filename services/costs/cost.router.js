const express = require('express');
const router = express.Router();
const { createCost, getMonthlyReport } = require('./cost.service');

// POST /api/add - add a new cost item
router.post('/add', async (req, res) => {
  try {
    const cost = await createCost(req.body);
    return res.status(201).json(cost);
  } catch (err) {
    const status = err.id === 'USER_NOT_FOUND' ? 404 : 400;
    return res.status(status).json({ id: err.id || 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/report - get monthly report for a user
router.get('/report', async (req, res) => {
  try {
    const { id, year, month } = req.query;
    const report = await getMonthlyReport(id, year, month);
    return res.status(200).json(report);
  } catch (err) {
    const status = err.id === 'USER_NOT_FOUND' ? 404 : 400;
    return res.status(status).json({ id: err.id || 'SERVER_ERROR', message: err.message });
  }
});

module.exports = router;
