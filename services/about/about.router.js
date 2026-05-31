const express = require('express');
const { getDevelopersTeam } = require('./about.service');

const router = express.Router();

router.get('/about', async (req, res) => {
  try {
    const team = getDevelopersTeam();
    return res.status(200).json(team);
  } catch (err) {
    return res.status(400).json({
      id: err.id || 'SERVER_ERROR',
      message: err.message
    });
  }
});

module.exports = router;