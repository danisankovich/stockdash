var mongoose = require('mongoose');

var budget = new mongoose.Schema({
  userId: String,
  budgetName: String,
  monthlyPrice: String,
  isActive: {type: Boolean, default: true},
  necessityLevel: String,
});

module.exports = mongoose.model('Budget', budget);
