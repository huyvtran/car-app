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
        'oc.lazyLoad',
        'angular-loading-bar',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'ngTouch'
    ])
    .constant('apiConfig', {
        // "host": "http://115.28.66.10"  //线上
        //"host": "http://siji.canguanwuyou.cn"
        // "host": "http://114.215.100.12"  //测试
         "host": ""  //本地
    })
    .run(function () {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: 'http://siji.canguanwuyou.cn/logistics/',
            localRoot: 'app',
            cacheBuster: true,
            checkTimeout: 10000,
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });

        function check(){
            loader.check()
                .then(function(){
                    console.log("-----into check ---------");
                    return loader.download();
                })
                .then(function(){
                    console.log("--------into download ---------");
                    return loader.update();
                },function(err){
                    console.error('Auto-update error:',err);
                });
        }

        check();
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
        }
    ]);


window.BOOTSTRAP_OK = true;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['logisticsApp']);
});
