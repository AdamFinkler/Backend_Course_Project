function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateUserId(id) {
  const userid = Number(id);

  if (!Number.isInteger(userid) || userid <= 0) {
    const error = new Error('id must be a positive number');
    error.id = 'VALIDATION_ERROR';
    throw error;
  }

  return userid;
}

function validateUserData(userData) {
  const id = validateUserId(userData.id);

  if (!isValidString(userData.first_name)) {
    const error = new Error('first_name is required');
    error.id = 'VALIDATION_ERROR';
    throw error;
  }

  if (!isValidString(userData.last_name)) {
    const error = new Error('last_name is required');
    error.id = 'VALIDATION_ERROR';
    throw error;
  }

  const birthday = new Date(userData.birthday);

  if (Number.isNaN(birthday.getTime())) {
    const error = new Error('birthday must be a valid date');
    error.id = 'VALIDATION_ERROR';
    throw error;
  }

  return {
    id,
    first_name: userData.first_name.trim(),
    last_name: userData.last_name.trim(),
    birthday
  };
}

module.exports = {
  validateUserData,
  validateUserId
};