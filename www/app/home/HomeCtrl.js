'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('HomeCtrl', function($rootScope, $scope, $http, $state, $location, apiConfig, OrderGroupService, ConfirmModalDialogService) {

        // 获取当前登录用户
        var originalPath = $location.path();

        if (window.sessionStorage['userRealName']) {
            $rootScope.userName = window.sessionStorage['userRealName'];
        } else {
            $http.get(apiConfig.host + "/admin/api/admin-user/me")
            .success(function (data, status) {
                $rootScope.userName = data.realname;

                window.sessionStorage['userRealName'] = data.realname;
                window.sessionStorage['userTelephone'] = data.telephone;

                $location.path(originalPath);
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取登录用户失败");
            })
        }

        // 获取订单评价
    	$http.get(apiConfig.host + "/admin/api/v2/tracker/evaluate")
            .success(function (data, status) {
                $scope.evaluate = data;
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取评分失败");
            });
            
        // 订单状态统计
        $scope.deliverOrderCount = 0;
        $scope.deliveredOrderCount = 0;

        OrderGroupService.getOrderGroups().then(function (data) {
            $scope.orderGroups = data;

            if ($scope.orderGroups && $scope.orderGroups.length > 0) {
                for (var i=0; i < $scope.orderGroups.length; i++) {
                    if ($scope.orderGroups[i].status.value === 2) {
                        $scope.deliveredOrderCount += 1; //已完成
                    } else {
                        $scope.deliverOrderCount += 1; //已出库：待配送
                    }
                }
            }
        });

        // 退出登录
        $scope.logout = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确定退出登录？", 
                function() {
                    $http({
                        url: apiConfig.host + "/admin/api/logout",
                        method: 'GET'
                    })
                    .success(function (data, status) {
                        delete $rootScope.user;

                        window.localStorage.removeItem('cachedUsername');
                        window.localStorage.removeItem('password');

                        window.sessionStorage.removeItem('userRealName');
                        window.sessionStorage.removeItem('userTelephone');

                        $state.go("login");
                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("退出异常");
                    })
                }
            );
        }
        
    });
