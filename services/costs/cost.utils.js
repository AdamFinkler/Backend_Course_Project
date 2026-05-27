const validCategories = ['food', 'health', 'housing', 'sports', 'education'];

// checks all required fields exist and are valid
function validateCostData(data) {
  const { description, category, userid, sum } = data;

  if (!description || !category || userid === undefined || sum === undefined) {
    const error = new Error('Missing required fields');
    error.id = 'MISSING_FIELDS';
    throw error;
  }

  if (!validCategories.includes(category)) {
    const error = new Error('Invalid category');
    error.id = 'INVALID_CATEGORY';
    throw error;
  }

  if (typeof userid !== 'number') {
    const error = new Error('userid must be a number');
    error.id = 'INVALID_USERID';
    throw error;
  }

  if (typeof sum !== 'number' || sum < 0) {
    const error = new Error('sum must be a positive number');
    error.id = 'INVALID_SUM';
    throw error;
  }
}

// checks that id, year, month are present and valid
function validateReportParams(id, year, month) {
  if (id === undefined || year === undefined || month === undefined) {
    const error = new Error('Missing required query parameters');
    error.id = 'MISSING_FIELDS';
    throw error;
  }

  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (Number.isNaN(parsedYear) || Number.isNaN(parsedMonth)) {
    const error = new Error('year and month must be numbers');
    error.id = 'INVALID_PARAMS';
    throw error;
  }

  if (parsedMonth < 1 || parsedMonth > 12) {
    const error = new Error('month must be between 1 and 12');
    error.id = 'INVALID_MONTH';
    throw error;
  }

  return { userid: Number(id), year: parsedYear, month: parsedMonth };
}

// if no date was sent, use current time
function parseCostDate(dateInput) {
  if (dateInput === undefined || dateInput === null) {
    return new Date();
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    const error = new Error('Invalid date');
    error.id = 'INVALID_DATE';
    throw error;
  }

  return date;
}

// server does not allow adding costs with past dates
function assertNotPastDate(date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (date < startOfToday) {
    const error = new Error('Cannot add costs with a date in the past');
    error.id = 'PAST_DATE_NOT_ALLOWED';
    throw error;
  }
}

// returns true if the requested month is already in the past
function isPastMonth(year, month) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return true;
  if (year > currentYear) return false;
  return month < currentMonth;
}

// returns start and end dates for the given month
function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

// groups costs by category and formats each item for the report
function buildReportCosts(costDocuments) {
  const grouped = {
    food: [],
    health: [],
    housing: [],
    sports: [],
    education: []
  };

  for (const cost of costDocuments) {
    grouped[cost.category].push({
      sum: cost.sum,
      description: cost.description,
      day: new Date(cost.created_at).getDate()
    });
  }

  // return in the required order - note that sports is returned as 'Sport'
  return [
    { food: grouped.food },
    { education: grouped.education },
    { health: grouped.health },
    { housing: grouped.housing },
    { sport: grouped.sports }
  ];
}

module.exports = {
  validCategories,
  validateCostData,
  validateReportParams,
  parseCostDate,
  assertNotPastDate,
  isPastMonth,
  getMonthRange,
  buildReportCosts
};
