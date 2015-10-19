var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/user');
var Stock = require('../models/stock');
var Budget = require('../models/budget');

mongoose.connect('mongodb://localhost/stock-dash');

router.get('/', function (req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/user', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    res.json(req.user);
  });
});

router.get('/search', function(req, res, next) {
  User.findById(req.user._id, function(err, user) {
    res.json(req.user);
  });
});

router.post('/search', function(req, res, next) {
  User.findById(req.user._id, function(err, user){
    Stock.create({
      userId: req.user._id,
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
        res.send();
      }
    });
  });
});

router.get('/portfolio', function(req, res, next) {
  Stock.find({userId: req.user._id}, function(err, stocks) {
    res.send(stocks);
  });
});

router.put('/money/:id', function(req, res, next) {
  console.log("salary", req.body.salary);
  User.findByIdAndUpdate(req.params.id,
    {
      salary: req.body.salary,
    }, {upsert: true}, function(err, user) {
      res.send(user);
    });
});
router.put('/takehome/:id', function(req, res, next) {
  console.log("takehome", req.body.takehome);
  User.findByIdAndUpdate(req.params.id,
    {
      takehome: req.body.takehome,
    }, {upsert: true}, function(err, user) {
      res.send(user);
    });
});

router.put('/stock/update/:id', function(req, res, next) {
  Stock.findByIdAndUpdate(req.params.id,
    {
      target: req.body.target,
      owned: req.body.owned,
      shares: req.body.shares,
    }, {upsert: true}, function(err, saved) {
      res.send(saved);
    });
});

router.delete('/stock/:id', function(req, res, next) {
  Stock.findByIdAndRemove(req.params.id, function(err, saved) {
    res.send();
  });
});


module.exports = router;
