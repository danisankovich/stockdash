app.controller('mainCtrl', function($scope, $state, $http){
  return $http.get('http://localhost:3000/search').success(function(user) {
    $scope.currentUser = user.displayName;
  });
});
app.controller('newsCtrl', function($scope, $state, $http){


});

app.controller('portfolioCtrl', function($scope, $state, $http, stockInfoService, $timeout){
  $scope.stocks='';
  $scope.moneySpentOnStocks = 0;
  $scope.currentStockValue = 0;

  $http.get('http://localhost:3000/user').success(function(user) {
    $scope.currentUser = user.displayName;
  });

  $http.get('http://localhost:3000/portfolio').success(function(stocks) {
    $scope.stocks = stocks;
  });
  $scope.showStockInfo = function() {
    $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + this.stock.symbol + "&callback=JSON_CALLBACK")
    .success(function(data) {
      $scope.currentPrice = data.LastPrice;
      $scope.thisCompany = data.Name;
      $scope.thisSymbol = data.Symbol;
    });
  };
});

app.controller('aboutCtrl', function($scope, $state, $http){
  return $http.get('http://localhost:3000/search').success(function(user) {
    $scope.currentUser = user.displayName;
  });
});

app.controller('budgetCtrl', function($scope, $state, $http, addStockService){
  $scope.budgetCalc = 0;
  $scope.moneySpentOnStocks = 0;
  $scope.currentStockValue = 0;
  var userIdentification;
  $(document).foundation();

  $http.get('http://localhost:3000/budget').success(function(budget) {
    $scope.budgets = budget;
    budget.forEach(function(e) {
      $scope.budgetCalc += parseInt(e.monthlyPrice);
    });
  });

  $http.get('http://localhost:3000/user').success(function(user) {
    $scope.user = user;
    $scope.currentUser = user.displayName;
    $scope.salary = user.salary;
    $scope.takehome = user.takehome;
    userIdentification = user._id;
  });
  $http.get('http://localhost:3000/portfolio').success(function(stocks) {
    $scope.stocks = stocks;
    stocks.forEach(function(e) {
      $scope.moneySpentOnStocks += Number(e.PAP)*Number(e.shares);
    });
    stocks.forEach(function(e) {
      Number($http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + e.symbol + "&callback=JSON_CALLBACK").success(function(data){
         $scope.currentStockValue += data.LastPrice*e.shares;
      }));
    });
  });

  $scope.addBudget = function() {
    addStockService.addBudget($scope.budget);
  };

  $scope.openEdit = function() {
    $scope.budgetName = this.budget.name;
    $scope.monthlyPrice = this.budget.monthlyPrice;
    $scope.necessityLevel = this.budget.necessityLevel;
    matchId = this.budget._id;
  };
  $scope.openMoneyEdit = function() {
    $scope.salary = $scope.user.salary;
    matchId = $scope.user._id;
  };
  $scope.openTakehomeEdit = function() {
    $scope.takehome = $scope.user.takehome;
  };

  $scope.editBudget = function(budget) {
    $http.put('/budget/' + matchId, budget)
    .success(function(response) {
      if (response === 'fail'){
        alert('Fail to edit ', 'Make sure year format is correct', 'error');
      } else {
        alert('Success', 'info updated.', 'success');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };

  $scope.editMoney = function(user) {
    $http.put('/money/' + $scope.user._id, user)
    .success(function(response) {
      if (response === 'fail'){
        alert('Fail to edit ', 'Make sure year format is correct', 'error');
      } else {
        alert('Success', 'info updated.', 'success');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };
  $scope.editTakehome = function(user) {
    $http.put('/takehome/' + $scope.user._id, user)
    .success(function(response) {
      if (response === 'fail'){
        alert('Fail to edit takehome', 'Make sure year format is correct', 'error');
      } else {
        alert('Success', 'takehome updated.', 'success');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };

  $scope.toggleBudget = function(budget) {
    $http.put('/budget/toggle/' + matchId, budget)
    .success(function(response) {
      if (response === 'fail'){
        alert('Fail to edit ', 'Make sure year format is correct', 'error');
      } else {
        alert('Success', 'info updated.', 'success');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };

  $scope.deleteBudget = function(budget) {
    matchId = this.budget._id;
    $http.delete('/budget/' + matchId, budget)
    .success(function(response) {
      if (response === 'fail'){
        alert('Fail to delete ', 'Please Try Again', 'error');
      } else {
        alert('Success', 'info deleted.', 'success');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };
});

app.controller('searchCtrl', function($scope, $state, $http, addStockService){

  $scope.currentUser ='';

  $scope.stockInfo = [];
  $scope.stockData =[];
  $scope.stock={symbol: '', Name: '', PAP: ''};
  $scope.shown = false;
  $scope.showForm = false;
  $scope.findBySymbol = function() {
    $scope.stockInfo = [];
    $scope.stockData =[];
    $http.jsonp("http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input="+$scope.symbol+"&callback=JSON_CALLBACK")
    .success(function(data) {
      $scope.stockInfo = data;
      $scope.stock.symbol = $scope.stockInfo[0].Symbol;
      $scope.stock.Name = $scope.stockInfo[0].Name;
      $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol="+$scope.stockInfo[0].Symbol+"&callback=JSON_CALLBACK")
      .success(function(timeData) {
        $scope.stockData = timeData;
        $scope.stock.PAP = $scope.stockData.LastPrice;
      });
    });
    return $scope.shown = true;
  };
  $scope.openForm = function() {
    $scope.showForm = true;
  };
  $scope.addStock = function() {
    addStockService.addStock($scope.stock);
  };

  $('#shares_owned_true').click(function() {
    $('#shares_owned').removeAttr("disabled");
  });

  $('#shares_owned_false').click(function() {
    $('#shares_owned').attr("disabled","disabled");
  });

  return $http.get('http://localhost:3000/search').success(function(user) {
    $scope.currentUser = user.displayName;
  });
});
