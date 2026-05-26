const Cost = require('../../models/cost.model');
const Report = require('../../models/report.model');
const User = require('../../models/user.model');
const {
  validateCostData,
  validateReportParams,
  parseCostDate,
  assertNotPastDate,
  isPastMonth,
  getMonthRange,
  buildReportCosts
} = require('./cost.utils');

// validates the data, checks user exists, and saves the new cost
async function createCost(costData) {
  validateCostData(costData);

  const user = await User.findOne({ id: costData.userid });
  if (!user) {
    const error = new Error('User not found');
    error.id = 'USER_NOT_FOUND';
    throw error;
  }

  // use the given date or default to now
  const created_at = parseCostDate(costData.created_at);
  assertNotPastDate(created_at);

  const { description, category, userid, sum } = costData;
  const cost = await Cost.create({ description, category, userid, sum, created_at });

  return {
    description: cost.description,
    category: cost.category,
    userid: cost.userid,
    sum: cost.sum,
    created_at: cost.created_at
  };
}

/*
 * Computed Design Pattern:
 * if the requested month is in the past, we check if a report was already
 * saved in the reports collection. if yes, return it directly.
 * if not, compute it from the costs collection, save it, and return it.
 * this works because the server does not allow adding costs with past dates,
 * so a past month report will never change.
 * for the current month or future months, always compute fresh.
 */
async function getMonthlyReport(id, year, month) {
  const { userid, year: reportYear, month: reportMonth } = validateReportParams(id, year, month);

  // make sure the user exists before building the report
  const user = await User.findOne({ id: userid });
  if (!user) {
    const error = new Error('User not found');
    error.id = 'USER_NOT_FOUND';
    throw error;
  }

  if (isPastMonth(reportYear, reportMonth)) {
    // check if a cached report already exists
    const cached = await Report.findOne({ userid, year: reportYear, month: reportMonth });

    if (cached) {
      return { userid: cached.userid, year: cached.year, month: cached.month, costs: cached.costs };
    }

    // no cache - compute, save and return
    const { start, end } = getMonthRange(reportYear, reportMonth);
    const costs = await Cost.find({ userid, created_at: { $gte: start, $lt: end } });
    const grouped = buildReportCosts(costs);

    await Report.create({ userid, year: reportYear, month: reportMonth, costs: grouped });

    return { userid, year: reportYear, month: reportMonth, costs: grouped };
  }

  // current or future month - just compute fresh
  const { start, end } = getMonthRange(reportYear, reportMonth);
  const costs = await Cost.find({ userid, created_at: { $gte: start, $lt: end } });
  const grouped = buildReportCosts(costs);

  return { userid, year: reportYear, month: reportMonth, costs: grouped };
}

module.exports = { createCost, getMonthlyReport };
