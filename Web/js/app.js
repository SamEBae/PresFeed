var app = angular.module('app', ['angularUtils.directives.dirPagination','ngRoute','nvd3ChartDirectives']);

app.config(['$routeProvider',
  function($routeProvider, $httpProvider) {
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
	$scope.id = 2; //change later
	$scope.connectedId 	= null;
	$scope.joined  		= false;
	$scope.joining 		= false; 
	$scope.joinError 	= false;
	$scope.questions = ["Poor", "Insufficient", "Average", "Good", "Excellent"];

	$scope.joinSession = function(){
		$scope.joining = true;

		console.log('http://159.203.9.155/presenters/'+$scope.id);
		
		$http.get('http://159.203.9.155/presenters/'+$scope.id).then(function successCallback(response) {
		    var presenterId = response.id;
		    $scope.joined 	= true;
		    $scope.joinError= false
		    $scope.joining	= false;
		    var data = {
		    	"observer":{
				      "status":2,
				      "presenter_id":$scope.id
				   	}
		    }
		    $http.post("http://159.203.9.155/observers/",data).success(function(response, status){
		    	$scope.connectedId = response.id;
		    	console.log(response)
		    });
	  	}, function errorCallback(response) {
	    	alert("Invalid Session ID");
	    	$scope.joinError= true;
	  		$scope.joining	= false;
	  	});
	}

	$scope.questionChanged = function(index){
		var data = {
	    	"observer":{
		    	"status":index
		   	}
	    };

	    $http({
	      method  : "PUT",
	      url     : 'http://159.203.9.155/observers/'+$scope.connectedId,
	      data    : data,
	      headers : { 'Content-Type': 'application/json' }
	    })
	    .success(function(response){
	    	console.log(response);
	    });


	    //$http.put("http://159.203.9.155/observers/2",data).success(function(response, status){});
	    //$http.put("http://159.203.9.155/observers/5",data).success(function(response, status){});
		// $http.put("http://159.203.9.155/observers/10",data).success(function(response, status){});
		// $http.put("http://159.203.9.155/observers/16",data).success(function(response, status){});
		// $http.put("http://159.203.9.155/observers/"+$scope.connectedId,data).success(function(response, status){});
	}
});


