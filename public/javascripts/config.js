var app = angular.module('StockDash', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', { url: '/', templateUrl: 'views/home.html', controller: 'mainCtrl' })
  .state('portfolio', { url: '/portfolio', templateUrl: 'views/portfolio.html', controller: 'portfolioCtrl' })
  .state('news', { url: '/news', templateUrl: 'views/news.html', controller: 'newsCtrl' })
  .state('search', { url: '/search', templateUrl: 'views/search.html', controller: 'searchCtrl' })
  .state('budget', { url: '/budget', templateUrl: 'views/budget.html', controller: 'budgetCtrl' });
}]);
