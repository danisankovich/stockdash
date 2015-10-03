var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/user');
var Stock = require('../models/stock');

mongoose.connect('mongodb://localhost/stockdash2');

router.get('/', function (req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/search', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
  // User.findById("560791eb04972cda27e66cb7").exec(function(err, user) {
    res.json(req.user);
  });
});

router.post('/search', function(req, res, next) {
  User.findById(req.user._id, function(err, user){
    Stock.create({
      name: req.body.Name,
      symbol: req.body.symbol,
      PAP: req.body.PAP,
      target: req.body.target,
      owned: req.body.owned,
      shares: req.body.shares,
    }, function(err, stock){
      if (!stock) {
        res.send('fail');
      }
      if (stock) {
        user.portfolio.push(stock);
        user.save();
      }
      res.send();
    });
  });
});

router.get('/dashboard', function(req, res, next) {
  User.findById(req.user._id).populate('portfolio').exec(function(err, user) {
    res.json(req.user);
  });
});


module.exports = router;
