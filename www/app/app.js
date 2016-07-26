'use strict';
/**
 * @ngdoc overview
 * @name logisticsApp
 * @description
 * # logisticsApp
 *
 * Main module of the application.
 */
angular
	.module('logisticsApp', [
        'ionic',
        'templatesCache',
        'ngCordova',
        'oc.lazyLoad',
        'angular-loading-bar',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'ngTouch'
    ])
    .constant('apiConfig', {
         //"host": "http://115.28.66.10",  //线上
        "host": "http://siji.canguanwuyou.cn"
        //"host": "http://114.215.100.12:8082" //测试
        //"host": "http://115.28.64.174:8087", //测试
        //"host": "",
        //"environment": "develop"
    })
    .run(function ($ionicPlatform, $cordovaFile,$cordovaFileOpener2,$ionicHistory,$rootScope,$cordovaToast, $cordovaFileTransfer,$timeout,ConfirmModalDialogService,$state,UpdateService,NetworkUtil) {

        $ionicPlatform.ready(function () {
            if (ionic.Platform.isAndroid()) {

                cordova.getAppVersion.getVersionCode(function (versionCode) {
                    var newVersionCode = 38;
                    if (versionCode < newVersionCode) {
                        ConfirmModalDialogService.AsyncConfirmYesNo("版本有更新，是否需要升级？",
                            function () {
                                var url = "http://download.canguanwuyou.cn/download/cgwy_car.apk";
                                var targetPath = cordova.file.externalApplicationStorageDirectory + 'cgwy/cgwy_car_' + newVersionCode + '.apk';
                                var trustHosts = true;
                                var options = {};
                                $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                                    .then(function (result) {
                                        // 打开下载下来的APP
                                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive')
                                            .then(function () {
                                            }, function (err) {
                                                ConfirmModalDialogService.AsyncAlert("文件打开失败，请稍后重试！");
                                            });
                                    }, function (err) {
                                        ConfirmModalDialogService.AsyncAlert("当前网络不稳定,下载失败!");
                                    }, function (progress) {
                                        $timeout(function () {
                                            var downloadProgress = (progress.loaded / progress.total) * 100;
                                            var msg = "已经下载:" + Math.floor(downloadProgress) + "%";
                                            ConfirmModalDialogService.AsyncDialogShow("下载进度" , msg);
                                            if (downloadProgress >= 99) {
                                                ConfirmModalDialogService.AsyncDialogHide();
                                            }
                                        })
                                    });
                            }
                        );
                    } else {

                        if (NetworkUtil.getNetworkRs()) {
                            var updateObject = function () {
                                UpdateService.updateApp().then(function (result) {
                                    if (result == 2) {
                                        ConfirmModalDialogService.AsyncConfirmYesNo("数据更新失败是否需要重试?",
                                        function(){
                                            updateObject();
                                        });
                                    }
                                });
                            }
                            updateObject();
                        }
                    }
                });


                $ionicPlatform.registerBackButtonAction(function (e) {
                    //alert($ionicHistory.currentStateName());
                    if ($rootScope.backButtonPressedOnceToExit) {
                        ionic.Platform.exitApp();
                    } else if (!$rootScope.devMode &&
                        ($ionicHistory.currentStateName().indexOf("home") == 0 || $ionicHistory.currentStateName().indexOf("login") == 0)) {

                        $rootScope.backButtonPressedOnceToExit = true;
                        $cordovaToast.show("再按一次返回退出", 'short', 'bottom');
                        setTimeout(function () {
                            $rootScope.backButtonPressedOnceToExit = false;
                        }, 2000);
                    }else if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    }
                    e.preventDefault();
                    return false;
                }, 101);

            }
        });
    })
	.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider', '$httpProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, $httpProvider, $provide) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            $urlRouterProvider.otherwise('/login');

            $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                return {
                    'responseError': function (rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = config.method;
                        var url = config.url;

                        if (status == 401) {
                            $location.path("/login");
                        } else {
                            $rootScope.error = method + " on " + url + " failed with status " + status;
                        }

                        return $q.reject(rejection);
                    }
                };
            });

            $stateProvider
	            .state('login', {
                    templateUrl: 'login/login.html',
                    controller: 'LoginCtrl',
                    url: '/login',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/login/login.js'
                                ]
                            })
                        }
                    }
	            })
                .state('home', {
                    templateUrl: 'home/home.html',
                    controller: 'HomeCtrl',
                    url: '/home',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/common/OrderGroupService.js',
                                    'app/home/HomeCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('today-order-list', {
                    templateUrl: 'today-order-list/today-order-list.html',
                    controller: 'TodayOrderListCtrl',
                    url: '/today-order-list/?{statusValue:int}',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/common/OrderGroupService.js',
                                    'app/today-order-list/TodayOrderListCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('today-order-detail', {
                    templateUrl: 'today-order-detail/today-order-detail.html',
                    controller: 'TodayOrderDetailCtrl',
                    url: '/today-order-detail/?orderId&backParams&restaurantId',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/common/OrderGroupService.js',
                                    'app/today-order-detail/TodayOrderDetailCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('redress-location', {
                    templateUrl: 'redress-location/redress-location.html',
                    controller: 'RedressLocationCtrl',
                    url: '/redress-location/?backParams',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/redress-location/RedressLocationCtrl.js',
                                    'app/common/OrderGroupService.js',
                                    'app/redress-location/MapService.js'
                                ]
                            })
                        }
                    }
                })
                .state('plan-path', {
                    templateUrl: 'plan-path/plan-path.html',
                    controller: 'PlanPathCtrl',
                    url: '/plan-path/?backParams',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/common/OrderGroupService.js',
                                    'app/redress-location/MapService.js'
                                ]
                            })
                        }
                    }
                })
                .state('stockOut-receive', {
                    templateUrl: 'stockout-receive/stockOut-receive.html',
                    controller: 'StockOutReceiveCtrl',
                    url: '/stockOut-receive/?stockOutId&backParams',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/stockout-receive/StockOutReceiveCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('query-page', {
                    templateUrl: 'home/query-page.html',
                    controller: 'QueryPageCtrl',
                    url: '/query-page',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/home/QueryPageCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('today-order-query', {
                    templateUrl: 'today-order-query/today-order-query.html',
                    controller: 'TodayOrderQueryCtrl',
                    url: '/today-order-query',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/common/OrderGroupService.js',
                                    'app/today-order-query/TodayOrderQuery.js'
                                ]
                            })
                        }
                    }
                })
                .state('out-of-stock', {
                    templateUrl: 'out-of-stock/out-of-stock.html',
                    controller: 'OutOfStockCtrl',
                    url: '/out-of-stock',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/out-of-stock/OutOfStockCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('return-goods-query', {
                    templateUrl: 'return-goods-query/return-goods-query.html',
                    controller: 'ReturnGoodsQueryCtrl',
                    url: '/return-goods-query/?page&pageSize&startReturnDate&endReturnDate',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/return-goods-query/ReturnGoodsQueryCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('histories-query', {
                    templateUrl: 'histories-query/histories-query.html',
                    controller: 'HistoriesQueryCtrl',
                    url: '/histories-query/?page&pageSize&startReceiveDate&endReceiveDate',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/histories-query/HistoriesQueryCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('profile', {
                    templateUrl: 'profile/profile.html',
                    controller: 'ProfileCtrl',
                    url: '/profile',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/profile/ProfileCtrl.js'
                                ]
                            })
                        }
                    }
                })
                .state('feedback', {
                    templateUrl: 'feedback/feedback.html',
                    controller: 'FeedbackCtrl',
                    url: '/feedback',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'logisticsApp',
                                files: [
                                    'app/feedback/FeedbackCtrl.js',
                                    'app/feedback/CameraService.js'
                                    //'app/feedback/FeedbackService.js'
                                ]
                            })
                        }
                    }
                })
        }
    ]);


window.BOOTSTRAP_OK = true;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['logisticsApp']);
});
