const User = require('../../models/user.model');
const Cost = require('../../models/cost.model');

const {
  validateUserData,
  validateUserId
} = require('./users.utils');

// validates the data, checks duplicate user, and saves the new user
async function createUser(userData) {
  const validatedUser = validateUserData(userData);

  const existingUser = await User.findOne({ id: validatedUser.id });

  if (existingUser) {
    const error = new Error('User already exists');
    error.id = 'USER_ALREADY_EXISTS';
    throw error;
  }

  const user = await User.create(validatedUser);

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    birthday: user.birthday
  };
}

// returns all users from the users collection
async function getAllUsers() {
  return User.find();
}

// returns specific user details and total costs
async function getUserDetails(id) {
  const userid = validateUserId(id);

  const user = await User.findOne({ id: userid });

  if (!user) {
    const error = new Error('User not found');
    error.id = 'USER_NOT_FOUND';
    throw error;
  }

  const totalCosts = await Cost.aggregate([
    { $match: { userid } },
    { $group: { _id: null, total: { $sum: '$sum' } } }
  ]);

  return {
    first_name: user.first_name,
    last_name: user.last_name,
    id: user.id,
    total: totalCosts[0]?.total || 0
  };
}

module.exports = {
  createUser,
  getAllUsers,
  getUserDetails
};