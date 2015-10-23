var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var logout = require('express-passport-logout');
var User = require('../models/user');
var Stock = require('../models/stock');
var Budget = require('../models/budget');

router.get('/', function(req, res, next) {
  Budget.find({userId: req.user._id}, function(err, budget) {
    res.send(budget);
  });
});


router.post('/', function(req, res, next) {
  User.findById(req.user._id, function(err, user){
    Budget.create({
      userId: req.user._id,
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

router.put('/:id', function(req, res, next) {
  Budget.findByIdAndUpdate(req.params.id,
    {
      budgetName: req.body.budgetName,
      monthlyPrice: req.body.monthlyPrice,
      necessityLevel: req.body.necessityLevel
    }, {upsert: true}, function(err, saved) {
      res.send(saved);
    });
});
// router.put('/:id/name', function(req, res, next) {
//   Budget.findByIdAndUpdate(req.params.id,
//     {
//       budgetName: req.body.budgetName,
//     }, {upsert: true}, function(err, saved) {
//       res.send(saved);
//     });
// });
// router.put('/:id/cost', function(req, res, next) {
//   Budget.findByIdAndUpdate(req.params.id,
//     {
//       monthlyPrice: req.body.monthlyPrice,
//     }, {upsert: true}, function(err, saved) {
//       res.send(saved);
//     });
// });
// router.put('/:id/cost/necessity', function(req, res, next) {
//   Budget.findByIdAndUpdate(req.params.id,
//     {
//       necessityLevel: req.body.necessityLevel
//     }, {upsert: true}, function(err, saved) {
//       res.send(saved);
//     });
// });

router.put('/toggle/:id', function(req, res, next) {
  Budget.findByIdAndUpdate(req.params.id,
    {
      isActive: req.body.active
    }, {upsert: true}, function(err, saved) {
      res.send(saved);
    });
});

router.delete('/:id', function(req, res, next) {
  Budget.findByIdAndRemove(req.params.id, function(err, saved) {
    res.send();
  });
});

module.exports = router;
