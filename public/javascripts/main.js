var app = angular.module('StockDash', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '/',
    templateUrl: 'views/home.html',
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html',
    controller: 'dashboardCtrl'
  })
  .state('news', {
    url: '/news',
    templateUrl: 'views/news.html'
  })
  .state('search', {
    url: '/search',
    templateUrl: 'views/search.html',
    controller: 'searchCtrl'
  });
}]);

app.controller('dashboardCtrl', function($scope, $state, $http, stockInfoService, $timeout){
  $scope.portfolio='';
  $http.get('http://localhost:3000/dashboard').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
    $scope.portfolio = user.portfolio;
    $scope.currentPrice='';
  }).success(function(){
    for(var i=0; i< $scope.portfolio.length; i++) {
      var cp = [];
      $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=" + $scope.portfolio[i].symbol + "&callback=JSON_CALLBACK")
      .success(function(data) {
        cp.push({currentPrice: data.LastPrice, name: data.Name});
      });
    };
    return $scope.currentPrice = cp;
  });
  $timeout(function() {
    portfolio = $scope.portfolio.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    currentPrice = $scope.currentPrice.sort(function(a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    for(var j = 0; j<portfolio.length; j++) {
      portfolio[j].currentPrice = currentPrice[j].currentPrice;
      console.log(portfolio[j].currentPrice);
    }
    $scope.portfolio = portfolio;
  }, 600);
});

app.controller('aboutCtrl', function($scope, $state){
  return $http.get('http://localhost:3000/search').success(function(user) {
    console.log("user", user);
    $scope.currentUser = user.displayName;
    $scope.stocks=$scope.currentuser.portfolio;
  });
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
});
app.service('stockInfoService', function($http, $stateParams, $state) {
  this.stockInfo=function() {
    $http.jsonp("http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol="+$scope.stockInfo[0].Symbol+"&callback=JSON_CALLBACK");
  };
});

// Lookup by symbol:
// "http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=%7B%22Normalized%22%3Afalse%2C%22NumberOfDays%22%3A365%2C%22DataPeriod%22%3A%22Day%22%2C%22Elements%22%3A%5B%7B%22Symbol%22%3A%22"+symbol+"%22%2C%22Type%22%3A%22price%22%2C%22Params%22%3A%5B%22c%22%5D%7D%5D%7D";

// lookup by ticker or name: probably have to use %20 or whatever for multi-word companies
// "http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input="+company ticker or name+"&callback=myFunction"

// for current value
//"http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol="+ticker+"&callback=myFunction"
