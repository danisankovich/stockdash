var app = angular.module('StockDash', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', { url: '/', templateUrl: 'views/home.html', controller: 'mainCtrl' })
  .state('dashboard', { url: '/dashboard', templateUrl: 'views/dashboard.html', controller: 'dashboardCtrl' })
  .state('news', { url: '/news', templateUrl: 'views/news.html' })
  .state('search', { url: '/search', templateUrl: 'views/search.html', controller: 'searchCtrl' })
  .state('budget', { url: '/budget', templateUrl: 'views/budget.html', controller: 'budgetCtrl' });
}]);

app.controller('mainCtrl', function($scope, $state, $http, stockInfoService){
  $scope.portfolio='';
  return $http.get('http://localhost:3000/search').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
  });
});

app.controller('dashboardCtrl', function($scope, $state, $http, stockInfoService, $timeout){
  $scope.portfolio='';
  $http.get('http://localhost:3000/dashboard').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
    $scope.portfolio = user.portfolio;
    // $scope.currentPrice='';
  });
  $scope.showStockInfo = function() {
    console.log(this.stock);
    $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + this.stock.symbol + "&callback=JSON_CALLBACK")
    .success(function(data) {
      $scope.currentPrice = data.LastPrice;
    });
  };
});

app.controller('aboutCtrl', function($scope, $state, $http){
  return $http.get('http://localhost:3000/search').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
  });
});

app.controller('budgetCtrl', function($scope, $state, $http, addStockService){
  var matchName;

  $(document).foundation();

  //  $scope.editId='';

  $http.get('http://localhost:3000/budget').success(function(budget) {
    console.log("budget", budget);
    $scope.budgets = budget;
  });

  $http.get('http://localhost:3000/user').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
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
      console.log($scope.stockInfo[0]);
      console.log('symbol', $scope.stockInfo[0].Symbol);
      $scope.stock.symbol = $scope.stockInfo[0].Symbol;
      $scope.stock.Name = $scope.stockInfo[0].Name;
      console.log('company', $scope.stockInfo[0].Name);
      $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol="+$scope.stockInfo[0].Symbol+"&callback=JSON_CALLBACK")
      .success(function(timeData) {
        $scope.stockData = timeData;
        console.log($scope.stockData);
        console.log('price at purchase', $scope.stockData.LastPrice);
        $scope.stock.PAP = $scope.stockData.LastPrice;
      });
      console.log($scope.shown);
      // return $scope.shown;
    });
    return $scope.shown = true;
  };
  $scope.openForm = function() {
    console.log("name: ", $scope.stock.Name, "symbol: ", $scope.stock.symbol, "price: ", $scope.stock.PAP);
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
    console.log("user", user);
    $scope.currentUser = user.displayName;
  });
});

app.service('addStockService', function($http, $stateParams, $state) {
  this.addStock = function(stock) {
    $http.post('/search', stock)
    .success(function(response) {
      if (response === 'fail') {
        alert('Fail to add Stock. ');
      } else {
        alert('Successfully added stock');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };
  this.addBudget = function(budget) {
    $http.post('/budget', budget)
    .success(function(response) {
      if (response === 'fail') {
        alert('Fail to add Stock. ');
      } else {
        alert('Successfully added stock');
      }
    }).catch(function(err) {
      console.log(err);
    });
  };
});
app.service('stockInfoService', function($http, $stateParams, $state) {
  this.stockInfo=function() {
    $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol="+$scope.stockInfo[0].Symbol+"&callback=JSON_CALLBACK");
  };
});
// lookup by ticker or name: probably have to use %20 or whatever for multi-word companies
// "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input="+company ticker or name+"&callback=myFunction"
