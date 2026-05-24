const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['food', 'health', 'housing', 'sports', 'education']
  },
  userid: {
    type: Number,
    required: true
  },
  sum: {
    type: Number,
    required: true,
    min: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cost', costSchema);