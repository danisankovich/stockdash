var mongoose = require('mongoose');

var user = new mongoose.Schema({
  displayName: {type: String, required: true},
  email: {type : String, required: true},
  image: String,
  moneyInStocks: Number,
  additionalPayments: Number,
  additionalIncomes: Number,
  favoriteNewsSources: [],
});

module.exports  = mongoose.model('User', user);
