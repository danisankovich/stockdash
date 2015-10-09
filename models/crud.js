var mongoose = require('mongoose');

var crud = new mongoose.Schema({
  author: String,
  message: String,
  price: String,
});

module.exports = mongoose.model('Crud', crud);
