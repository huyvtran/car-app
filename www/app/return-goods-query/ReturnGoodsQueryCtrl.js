'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:ReturnGoodsQueryCtrl
 * @description
 * # ReturnGoodsQueryCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('ReturnGoodsQueryCtrl', function($scope, $stateParams, $filter, $http, $location, apiConfig, ConfirmModalDialogService) {

    	$scope.searchForm = {
    		page : $stateParams.page,
            pageSize : $stateParams.pageSize,
            startReturnDate : $stateParams.startReturnDate,
            endReturnDate : $stateParams.endReturnDate
		};

		$scope.subTotal = 0;
		$scope.format = 'yyyy-MM-dd';
		$scope.page = {itemsPerPage : 50};
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
            $scope.searchForm.startReturnDate = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        $scope.$watch('endDate', function(newVal) {
            $scope.searchForm.endReturnDate = $filter('date')(newVal, 'yyyy-MM-dd');
        });

        if ($scope.searchForm.startReturnDate) {
            $scope.startDate = Date.parse($scope.searchForm.startReturnDate);
        }

        if ($scope.searchForm.endReturnDate) {
            $scope.endDate = Date.parse($scope.searchForm.endReturnDate);
        }

        $http({
            url: apiConfig.host + "/admin/api/v2/tracker/sellReturnItem/list",
            method: "GET",
            params: $scope.searchForm
        })
        .success(function (data, status) {
            // console.log(data);
            $scope.returnGoodsItems = data.content;

            for (var i=0; i < $scope.returnGoodsItems.length; i++) {
                var returnGoodsItem = $scope.returnGoodsItems[i];
                $scope.subTotal += returnGoodsItem.amount;

                $scope.returnGoodsItems[i].amount = returnGoodsItem.amount.toFixed(2);
            }

            $scope.showLoading = false;

            $scope.page.itemsPerPage = data.pageSize;
            $scope.page.totalItems = data.total;
            $scope.page.currentPage = data.page + 1;
        })
        .error(function (data, status) {
            ConfirmModalDialogService.AsyncAlert("获取退货数据失败");
            
            $scope.showLoading = false;
        });

        $scope.resetPageAndSearch = function () {
            $scope.searchForm.page = 0;
            $scope.searchForm.pageSize = 50;

            $location.search($scope.searchForm);
        };

        $scope.pageChanged = function() {
            $scope.searchForm.page = $scope.page.currentPage - 1;
            $scope.searchForm.pageSize = $scope.page.itemsPerPage;

            $location.search($scope.searchForm);
        }

    });