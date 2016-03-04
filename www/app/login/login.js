'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('LoginCtrl', function($scope, $http, $state, apiConfig, ConfirmModalDialogService) {

        $scope.isLoginState = false;

    	$scope.user = {
            username: '',
            password: ''
        };

        $scope.isLocalStorageSupported = function () {
            var testKey = 'testKey',
                storage = window.localStorage;

            try {
                storage.setItem(testKey, 'testValue');
                storage.removeItem(testKey);
                return true;
            } catch (error) {
                return false;
            }
        };

        // 登录
        $scope.login = function (user) {
            if (user.username === "") {
                ConfirmModalDialogService.AsyncAlert("登录用户名不能为空");
                return;
            }
            if (user.password === "") {
                ConfirmModalDialogService.AsyncAlert("登录密码不能为空");
                return;
            }

            $scope.isLoginState = true;

            $http({
                url: apiConfig.host + "/api/login",
                method: 'POST',
                data: user
            })
            .success(function (data, status) {
                if ($scope.isLocalStorageSupported()) {
                    window.localStorage['cachedUsername'] = user.username;
                    window.localStorage['password'] = user.password;
                }

                // document.cookie = "realName="+escape(data.name);

                $state.go("home");

                $scope.isLoginState = false;
            })
            .error(function (data, status) {
                $scope.isLoginState = false;

                if (data)
                    ConfirmModalDialogService.AsyncAlert(data.errmsg);
                else
                    ConfirmModalDialogService.AsyncAlert("登录失败");
            });
        };

        if (window.localStorage['cachedUsername']) {
            $scope.user.username = window.localStorage['cachedUsername'];
            $scope.user.password = window.localStorage['password'];

            $scope.login($scope.user);
        }

        // 重置
        $scope.reset = function () {
            $scope.user.username = "";
            $scope.user.password = "";
        };

    });
