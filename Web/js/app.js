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
    $scope.showHide = false;
	console.log($scope.sessionCreated);

	$scope.createSession = function(){
        var session_url = 'http://159.203.9.155/presenters'
        // create session
        $http.post(session_url)
	 	.success(function(response){
            $scope.showHide = true;
        	$scope.sessionCreated = true;
            // find created session
            $http.get(session_url)
            .success(function(response){
                console.log(response);
                $scope.sessionId = response[response.length-1].id;
            }
            )
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