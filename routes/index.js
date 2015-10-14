var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/user');
var Stock = require('../models/stock');
var Budget = require('../models/budget');

mongoose.connect('mongodb://localhost/stock-dash');
// mongoose.connect('mongodb://localhost/sanky');

router.get('/', function (req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/search', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
  // User.findById("560791eb04972cda27e66cb7").exec(function(err, user) {
    res.json(req.user);
  });
});

router.get('/user', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
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
        res.send();
      }
    });
  });
});

router.get('/dashboard', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    res.send(req.user);
  });
});

router.get('/budget', function(req, res, next) {
  Budget.find({userId: req.user._id}, function(err, budget) {
    res.send(budget);
  });
});


router.post('/budget', function(req, res, next) {
  User.findById("560791eb04972cda27e66cb7", function(err, user){
    Budget.create({
      userId: "560791eb04972cda27e66cb7",
      budgetName: req.body.budgetName,
      monthlyPrice: req.body.monthlyPrice,
      necessityLevel: req.body.necessityLevel,
    }, function(err, budget){
      if (!budget) {
        res.send('fail');
      }
      if (budget) {
        res.send();
      }
    });
  });
});

router.put('/budget/:id', function(req, res, next) {
  Budget.findByIdAndUpdate(req.params.id,
    {
      budgetName: req.body.budgetName,
      monthlyPrice: req.body.monthlyPrice,
      necessityLevel: req.body.necessityLevel
    }, {upsert: true}, function(err, saved) {
      res.send(saved);
    });
});

router.delete('/budget/:id', function(req, res, next) {
  Budget.findByIdAndRemove(req.params.id, function(err, saved) {
    res.send();
  });
});

router.put('/stock/update', function(req, res, next) {
  Stock.update(
    {key1: "useless string"},
    {$set: {key2: req.body.key2,
            key3: req.body.key3}},
    {upsert: true}, function(err, stock) {
    res.send(stock);
  });
});

router.delete('/stock/delete/:id', function(req, res, next) {
  Stock.remove({"_id": req.params.id}, function(err, stock){
    res.send(stock);
  });
});


module.exports = router;
