const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('message', messageSchema);
