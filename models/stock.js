var mongoose = require('mongoose');

var stock = new mongoose.Schema({
  name: String,
  symbol: String,
  PAP: String,
  target: Number,
  owned: Boolean,
  shares: {type: Number, default: 0}
});

module.exports = mongoose.model('Stock', stock);
