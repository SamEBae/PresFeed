var app = angular.module('app', ['angularUtils.directives.dirPagination','ngRoute','nvd3ChartDirectives']);
setTimeout(function(){
    //do what you need here
}, 2000);
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/session', {
        templateUrl: 'main.html',
        controller: 'defaultController'
      }).
      when('/dashboard', {
        templateUrl: 'dashboard.html',
        controller: 'dashboardController'
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

app.controller('dashboardController', function($scope, $http, $interval, serverService){
	$scope.errorMessage = false;
	$scope.url 			= window.location.href;
	$scope.sessionId 	= $scope.url.substring($scope.url.indexOf("?id")+4,$scope.url.length);
    $scope.audienceSize = 0;
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
			value: 0.1
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

    $interval(function() {
        serverService.getPresenterById($scope.sessionId).then(function(response){
            if(response.success===false){
                $scope.errorMessage = true;
                return;
            }
            serverService.getAllObserversById($scope.sessionId).then(function(response){
                if(response.success==false){
                    $scope.audienceSize = 0;
                    return;   
                }

                $scope.audienceSize = response.length;
                $scope.observerData[2].value =0;

                for(var index in $scope.observerData){
                    $scope.observerData[index].value = 0;
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
        });
    }, 5000);
	
    $scope.pieMode = true;
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

    $scope.totalDataCopy =$scope.totalData;
    $scope.totalData = [
      {
            key: "Cumulative Return",
            values: [
                ["Poor", 0 ],
                ["Insufficient" , 0 ],
                ["Average" , 0 ],
                ["Good" , 0 ],
                ["Excellent" , 0 ]
            ]
        }
    ];
}).directive('myCurrentTime', ['$interval', 'dateFilter',
    function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            var format,  // date format
              stopTime; // so that we can cancel the time updates

        // used to update the UI
        function checkNotification() {
        // Call notification if threshold is broken.

            observerDataCopy = scope.observerDataCopy;
            var totalUsers = 0;
            var unsatisfied = 0;
            var limitPercentage = 0.3;

            for (var index in observerDataCopy){
                if(observerDataCopy[index].key == 'Poor' || observerDataCopy[index].key == 'Insufficient') {
                    unsatisfied += observerDataCopy[index].value;
                }
                totalUsers += observerDataCopy[index].value;
            }

            console.log("Stats: " + unsatisfied / totalUsers);

            if (unsatisfied / totalUsers > limitPercentage) {
                // Notificaiton here
                var options = {
                  sound: 'audio/alert.mp3',
                  icon: 'images/presfeed.png',
                  body: "Hey there! Your audience is struggling!"
                }

                var notification = new Notification('Notification title', options);

                var sound = notification.sound;
            }
        }

        // watch the expression, and update the UI on change.
        scope.$watch(attrs.nvd3PieChart, function(value) {
            format = value;
            checkNotification();
        });

        stopTime = $interval(checkNotification, 5000);

        // listen on DOM destroy (removal) event, and cancel the next UI update
        // to prevent updating time after the DOM element was removed.
        element.on('$destroy', function() {
            $interval.cancel(stopTime);
        });
    }
}]);

app.controller('joinController', function($scope, $http, $routeParams, serverService){
	$scope.joinId; //change later
	$scope.connectedId 	= null;
	$scope.joined  		= false;
	$scope.joining 		= false; 
	$scope.joinError 	= false;
	$scope.questions = ["Poor", "Insufficient", "Average", "Good", "Excellent"];

	$scope.joinSession = function(){
		$scope.joining = true;

		serverService.getPresenterById($scope.joinId).then(function(response){
			if(response.success===false){
				alert("Invalid Session ID");
    			$scope.joinError= true;
  				$scope.joining	= false;
  				return;
			}
			var presenterId = response.id;
		    $scope.joined 	= true;
		    $scope.joinError= false
		    $scope.joining	= false;
		    var data = {
		    	"observer":{
				      "status":2,
				      "presenter_id":$scope.joinId
				   	}
		    }

		    serverService.createObserver(data).then(function(response){
		    	$scope.connectedId = response.id;
		    });
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