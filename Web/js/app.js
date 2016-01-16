var app = angular.module('app', ['angularUtils.directives.dirPagination']);
app.run(['$http', '$q', function ($http, $q) {
}])
.controller('defaultController', function($scope, $http) {
	console.log("started!");

});