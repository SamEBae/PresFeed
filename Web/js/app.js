var app = angular.module('app', ['angularUtils.directives.dirPagination','ngRoute']);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/session', {
        templateUrl: 'main.html',
        controller: 'defaultController'
      }).
      when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'defaultController'
      }).
      otherwise({
        redirectTo: '/session'
      });
  }]);

app.controller('defaultController', function($scope, $http) {
	$scope.sessionCreated = false;
	$scope.sessionId = 12;
	console.log($scope.sessionCreated);
	$scope.createSession = function(){
	 	$http.get('http://httpbin.org/get', {cache: null})
	 	.success(function(response){
        	$scope.sessionCreated = true;
        	$scope.sessionId = 99;
    	});
	}
});

app.controller('dashboardController', function($scope, $http){
	
});