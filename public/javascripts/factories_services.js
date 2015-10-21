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
        alert('Fail to add budget item. ');
      } else {
        alert('Successfully added budget item');
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
