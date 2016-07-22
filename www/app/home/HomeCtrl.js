'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('HomeCtrl', function ($rootScope, $scope, $http, $state, $location, apiConfig, OrderGroupService, ConfirmModalDialogService) {

        // 获取当前登录用户
        var originalPath = $location.path();

        if (window.sessionStorage['userRealName'] && window.sessionStorage['name']) {
            $rootScope.userName = window.sessionStorage['userRealName'];
            $rootScope.name = window.sessionStorage['name'];
        } else {
            $http.get(apiConfig.host + "/admin/api/admin-user/me")
                .success(function (data, status) {
                    $rootScope.userName = data.realname;
                    $rootScope.name = data.username;

                    window.sessionStorage['userRealName'] = data.realname;
                    window.sessionStorage['name'] = data.username;
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
                for (var i = 0; i < $scope.orderGroups.length; i++) {
                    if ($scope.orderGroups[i].status.value === 2) {
                        $scope.deliveredOrderCount += 1; //已完成
                    } else {
                        $scope.deliverOrderCount += 1; //已出库：待配送
                    }
                }
            }
        });

        OrderGroupService.getUserId().then(function(data){
            $scope.userId = data.id;
           $http.get(apiConfig.host + "/admin/api/signInState/" +data.id)
                .success(function (data, status) {
                    $scope.signStatus = data;
                })
        })

            /*$http.get(apiConfig.host + "/admin/api/admin-user/me")
                .success(function (data, status) {
                    $scope.userId = data.id;
                    $http.get(apiConfig.host + " /api/signInState/" + $scope.userId)
                        .success(function (data, status) {
                            alert(12344);
                            $scope.signStatus = data;
                        })
                })*/



        $scope.sign = function () {
            if ($scope.signStatus == false) {
                $http.get(apiConfig.host + "/admin/api/signIn/" + $scope.userId)
                    .success(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("签到成功!");
                        $scope.data = data;
                        $scope.signTime = data.carSignDate;
                        $scope.nowTime = new Date()
                        $scope.signStatus = true;
                        var signMonth = $scope.signTime.getMonth() + 1;
                        var nowMonth = $scope.signTime.getMonth() + 1;
                        var signDate = $scope.signTime.getFullYear() + "/" + signMonth + "/" + $scope.signTime.getDate();
                        var nowDate = $scope.nowTime.getFullYear() + "/" + nowMonth + "/" + $scope.nowTime.getDate();

                        var nowHours = $scope.nowTime.getHours();
                        var nowMin = $scope.nowTime.getMinutes();

                        if (signDate == nowDate) {
                            if (nowHours >= 0 && nowMin >= 0) {
                                $scope.signStatus = false;
                            }
                        }
                        ConfirmModalDialogService.AsyncAlert("签到成功!");

                    })
                    .error(function (data, status) {
                        ConfirmModalDialogService.AsyncAlert("签到失败");
                    });
            } else {
                ConfirmModalDialogService.AsyncAlert("已经签过了");
            }

        }


    });
