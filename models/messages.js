const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', messageSchema);
