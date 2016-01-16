var app = angular.module('app', ['angularUtils.directives.dirPagination','ngRoute','nvd3ChartDirectives']);

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
	$scope.pieMode = true;
	$scope.exampleData = [
            {
                key: "One",
                y: 5
            },
            {
                key: "Two",
                y: 2
            },
            {
                key: "Three",
                y: 9
            },
            {
                key: "Four",
                y: 7
            },
            {
                key: "Five",
                y: 4
            },
            {
                key: "Six",
                y: 3
            },
            {
                key: "Seven",
                y: 9
            }
        ];

    $scope.xFunction = function(){
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function(){
        return function(d) {
            return d.y;
        };
    }

    $scope.descriptionFunction = function(){
        return function(d){
            return d.key;
        }
    }
});


app.controller('joinController', function($scope, $http, $routeParams){

	$scope.joinSession = function(){
		//alert("joining session");
		$http({
		  method: 'GET',
		  url: 'http://159.203.9.155/presenters'
		}).then(function successCallback(response) {
		    console.log(response);
	  	}, function errorCallback(response) {
	    	// called asynchronously if an error occurs
	    	// or server returns response with an error status.
	  	});

	}
});