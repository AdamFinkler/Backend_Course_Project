const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  status_code: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);



