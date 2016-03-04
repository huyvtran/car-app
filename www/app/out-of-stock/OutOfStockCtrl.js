'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:OutOfStockCtrl
 * @description
 * # OutOfStockCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('OutOfStockCtrl', function($scope, $http, apiConfig, ConfirmModalDialogService) {

    	$scope.subTotal = 0;
    	$scope.showLoading = true;

    	$http({
            url: apiConfig.host + "/admin/api/v2/tracker/sellCancelItem/list",
            method: "GET"
        })
        .success(function (data, status) {
            // console.log(data.content);
            $scope.outOfStockItems = data.content;

            for (var i=0; i < $scope.outOfStockItems.length; i++) {
            	$scope.subTotal += $scope.outOfStockItems[i].amount;
            }

            $scope.showLoading = false;
        })
        .error(function (data, status) {
            ConfirmModalDialogService.AsyncAlert("获取缺货商品数据失败");
            $scope.showLoading = false;
        });
    });