'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:HistoriesQueryCtrl
 * @description
 * # HistoriesQueryCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('HistoriesQueryCtrl', function($scope, $stateParams, $filter, $http, $location, apiConfig, ConfirmModalDialogService) {
    	
    	$scope.searchForm = {
            page : $stateParams.page,
            pageSize : $stateParams.pageSize,
            startReceiveDate : $stateParams.startReceiveDate,
            endReceiveDate : $stateParams.endReceiveDate
		};

		$scope.subTotal = 0;
		$scope.format = 'yyyy-MM-dd';
		$scope.page = {itemsPerPage : 100};
        $scope.showLoading = true;

		$scope.openStart = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedEnd = false;
            $scope.openedStart = true;
        };

        $scope.openEnd = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedStart = false;
            $scope.openedEnd = true;
        };

        $scope.dateOptions = {
            dateFormat: 'yyyy-MM-dd',
            formatYear: 'yyyy',
            startingDay: 1,
            startWeek: 1
        };

        $scope.$watch('startDate', function(newVal) {
            $scope.searchForm.startReceiveDate = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        $scope.$watch('endDate', function(newVal) {
            $scope.searchForm.endReceiveDate = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        if ($scope.searchForm.startReceiveDate) {
            $scope.startDate = Date.parse($scope.searchForm.startReceiveDate);
        }

        if ($scope.searchForm.endReceiveDate) {
            $scope.endDate = Date.parse($scope.searchForm.endReceiveDate);
        }

        $http({
            url: apiConfig.host + "/admin/api/v2/tracker/stockOutReceive/list",
            method: "GET",
            params: $scope.searchForm
        })
        .success(function (data, status) {
            // console.log(data);
            $scope.historyOrderLists = data.content;

            for (var i=0; i < $scope.historyOrderLists.length; i++) {
                var historyOrderList = $scope.historyOrderLists[i];
                $scope.subTotal += historyOrderList.amount;

                // $scope.historyOrderLists[i].amount = historyOrderList.amount.toFixed(2);
            }

            $scope.showLoading = false;

            $scope.page.itemsPerPage = data.pageSize;
            $scope.page.totalItems = data.total;
            $scope.page.currentPage = data.page + 1;
        })
        .error(function (data, status) {
            ConfirmModalDialogService.AsyncAlert("获取历史数据失败");

            $scope.showLoading = false;
        });

        $scope.resetPageAndSearch = function () {
            $scope.searchForm.page = 0;
            $scope.searchForm.pageSize = 100;

            $location.search($scope.searchForm);
        };

        $scope.pageChanged = function() {
            $scope.searchForm.page = $scope.page.currentPage - 1;
            $scope.searchForm.pageSize = $scope.page.itemsPerPage;

            $location.search($scope.searchForm);
        }
    });