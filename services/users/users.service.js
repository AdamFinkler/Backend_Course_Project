const User = require('../../models/user.model');
const Cost = require('../../models/cost.model');

async function createUser(userData) {
  const existingUser = await User.findOne({ id: userData.id });

  if (existingUser) {
    const error = new Error('User already exists');
    error.id = 'USER_ALREADY_EXISTS';
    throw error;
  }

  return User.create(userData);
}

async function getAllUsers() {
  return User.find();
}

async function getUserDetails(id) {
  const user = await User.findOne({ id: Number(id) });

  if (!user) {
    const error = new Error('User not found');
    error.id = 'USER_NOT_FOUND';
    throw error;
  }

  const totalCosts = await Cost.aggregate([
    { $match: { userid: Number(id) } },
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