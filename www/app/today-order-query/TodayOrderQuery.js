'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:TodayOrderQueryCtrl
 * @description
 * # TodayOrderQueryCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('TodayOrderQueryCtrl', function($scope, OrderGroupService, ConfirmModalDialogService) {

    	$scope.deliverOrderCount = 0;
    	$scope.deliverOrderTotal = 0;
        $scope.deliveredOrderCount = 0;
        $scope.deliveredOrderTotal = 0;
        $scope.subTotal = 0;

        OrderGroupService.getOrderGroups().then(function (data) {
            $scope.orderGroups = data;

            if ($scope.orderGroups && $scope.orderGroups.length > 0) {
                for (var i=0; i < $scope.orderGroups.length; i++) {
                    if ($scope.orderGroups[i].status.value === 2) {
                        $scope.deliveredOrderCount += 1; //已完成：已配送
                        $scope.deliveredOrderTotal += $scope.orderGroups[i].total;
                    } else {
                        $scope.deliverOrderCount += 1; //已出库：待配送
                        $scope.deliverOrderTotal += $scope.orderGroups[i].total;
                    }

                    $scope.subTotal += $scope.orderGroups[i].total;
                }
            } else {
            	ConfirmModalDialogService.AsyncAlert("今日暂无配送订单");
                return;
            }
        });

    });