'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:QueryPageCtrl
 * @description
 * # QueryPageCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('QueryPageCtrl', function($scope, $filter) {

	    var newDate = new Date();
	    newDate.setDate(newDate.getDate() + 1);
	    
	    $scope.startDate = $filter('date')(new Date(), 'yyyy-MM-dd');
	    $scope.endDate = $filter('date')(newDate, 'yyyy-MM-dd');

    });