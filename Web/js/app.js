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
    $scope.showHide 	  = false;

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
                $scope.sessionId = response[response.length-1].id;
            }
            )
    	});

	}
});

app.controller('dashboardController', function($scope, $http, serverService){
	$scope.errorMessage = false;
	$scope.url 			= window.location.href;
	$scope.sessionId 	= $scope.url.substring($scope.url.indexOf("?id")+4,$scope.url.length);
	$scope.observerData = [
		{
			key: 'Poor',
			value: 0
		},
		{
			key: 'Insufficient',
			value: 0
		},
		{
			key: 'Average',
			value: 1
		},
		{
			key: 'Good',
			value: 0
		},
		{
			key: 'Excellent',
			value: 0
		}
	];
	$scope.observerDataCopy = $scope.observerData.slice();
	serverService.getAllObserversById($scope.sessionId).then(function(response){
		if(response.success===false){
			$scope.errorMessage = true;
		}
		for(var index in response){
			if(response[index].status<5){
				$scope.observerData[response[index].status].value++;
			}
		}
		$scope.observerDataCopy = $scope.observerData;
	},function handleError(response){
		alert("error getting observers");
	});

	$scope.pieMode = true;
	$scope.exampleData = [
            {
                key: "One",
                value: 5
            },
            {
                key: "Two",
                value: 2
            },
            {
                key: "Three",
                value: 9
            },
            {
                key: "Four",
                value: 7
            },
            {
                key: "Five",
                value: 4
            },
            {
                key: "Six",
                value: 3
            },
            {
                key: "Seven",
                value: 9
            }
        ];

    $scope.xFunction = function(){
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function(){
        return function(d) {
            return d.value;
        };
    }

    $scope.descriptionFunction = function(){
        return function(d){
            return d.key;
        }
    }
});


app.controller('joinController', function($scope, $http, $routeParams, serverService){
	$scope.id; //change later
	$scope.connectedId 	= null;
	$scope.joined  		= false;
	$scope.joining 		= false; 
	$scope.joinError 	= false;
	$scope.questions = ["Poor", "Insufficient", "Average", "Good", "Excellent"];

	$scope.joinSession = function(){
		$scope.joining = true;

		serverService.getPresenterById($scope.id).then(function(response){

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

		    serverService.createObserver(data).then(function(response){
		    	$scope.connectedId = response.id;
		    });
		},
		function errorCallback(response){	
	    	alert("Invalid Session ID");
    		$scope.joinError= true;
  			$scope.joining	= false;
		})
	}

	$scope.questionChanged = function(index){
		var data = {
	    	"observer":{
		    	"status":index
		   	}
	    };
	    serverService.UpdateObserver($scope.connectedId, data);
	}
});

app.factory('serverService', function($http){
	var service = {};
    var baseApi = 'http://159.203.9.155';

    service.getPresenterById 	 = getPresenterById;
    service.getAllObserversById  = getAllObserversById; 
    service.UpdateObserver 	 = UpdateObserver;
    service.createObserver 	 = createObserver;
   	
    return service;
    //creates
    function createObserver(data){
    	return $http.post(baseApi+"/observers/",data).then(handleSuccess, handleError('Error getting presenter'));
    }
    //gets
    function getPresenterById(id){
    	return $http.get(baseApi+'/presenters/'+id).then(handleSuccess, handleError('Error getting presenter'));
    }
    function getAllObserversById(presenterId){
    	return $http.get(baseApi+'/observers?presenter_id='+presenterId).then(handleSuccess, handleError('Error getting observers'));
    }
    //updates
    function UpdateObserver(id, data) {
    	return $http({
	      method  : "PUT",
	      url     : baseApi + '/observers/' + id,
	      data    : data,
	      headers : { 'Content-Type': 'application/json' }
	    }).then(handleSuccess, handleError('Error updating observer'));
    }

    function handleSuccess(res) {
        return res.data;
    }
 
    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

});