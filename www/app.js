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

angular.module('logisticsApp')
	.factory('ConfirmModalDialogService', function () {

		var service = {};

		service.AsyncConfirmYesNo = function (msg, yesFn) {
			var $confirm = $("#modalConfirmYesNo");
		    
		    $confirm.modal({backdrop: 'static', keyboard: false});
		    $confirm.modal('show');
		    
		    $("#lblMsgConfirmYesNo").html(msg);

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		    });

		    $("#btnYesConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		        yesFn();
		    });
		}

		service.AsyncAlert = function (msg) {
			var $alert = $("#alertModal");
		    
		    $alert.modal({backdrop: 'static', keyboard: false});
		    $alert.modal('show');
		    
		    $("#alertMsg").html(msg);

		    $("#alertBtn").off('click').click(function () {
		        $alert.modal("hide");
		        $("body .modal-backdrop").remove();
		    });
		}

		return service;
	});
angular.module('logisticsApp')
	.factory('OrderGroupService', function ($http, apiConfig) {

		var service = {};

		service.getOrderGroups = function () {
			return $http({
				url: apiConfig.host + "/admin/api/v2/orderGroups",
				method: "GET"
			}).then(function (payload) {
				return payload.data;
			})
		};

		service.setRestaurantInfo = function (order) {
			service.order = order; 
		}

		service.getRestaurantInfo = function () {
			return service.order; 
		}

		return service;
	});
angular.module('logisticsApp')
    .factory('UpdateService', ['$log', '$q', 'apiConfig', function ($log, $q, apiConfig) {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: 'http://115.28.66.10/logistics/',
            localRoot: 'app',
            cacheBuster: true, // make sure we're not downloading cached files.
            checkTimeout: 10000, // timeout for the "check" function - when you loose internet connection
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });
        var service = {
            // Check for new updates on js and css files
            check: function () {
                var defer = $q.defer();

                if(apiConfig.environment == "develop") {
                    defer.resolve(false);
                } else {
                    loader.check().then(function (updateAvailable) {
                        console.log("Update available:");
                        
                        if (updateAvailable) {
                            defer.resolve(updateAvailable);
                        }
                        else {
                            defer.reject(updateAvailable);
                        }
                    });
                }

                return defer.promise;
            },
            // Download new js/css files
            download: function (onprogress) {
                var defer = $q.defer();

                loader.download(onprogress).then(function (manifest) {
                    console.log("Download active!");
                    defer.resolve(manifest);
                }, function (error) {
                    console.log("Download Error:");
                    defer.reject(error);
                });
                return defer.promise;
            },
            // Update the local files with a new version just downloaded
            update: function (reload) {
                console.log("update files--------------");
                return loader.update(reload);
            },
            // Check wether the HTML file is cached
            isFileCached: function (file) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.isCached(file);
                }
                return false;
            },
            // returns the cached HTML file as a url for HTTP interceptor
            getCachedUrl: function (url) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.get(url);
                }
                return url;
            }
        };

        return service;

    }])

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
'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:StockOutReceiveCtrl
 * @description
 * # StockOutReceiveCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('StockOutReceiveCtrl', function ($scope, $rootScope, $http, $stateParams, $location, $state, $filter, apiConfig, ConfirmModalDialogService) {
        
        $("body").removeClass("modal-open");
        $("body .modal-backdrop").remove();

        $scope.backParams = $stateParams.backParams;
        $scope.stockOutId = $stateParams.stockOutId;

        $scope.stockOutForm = {};
        $scope.stockOutItems = [];
        $scope.collectionments = [];
        $scope.methods = [];
        $scope.cashMethod = null;
        $scope.isReceiveAmountLessZero = false;
        $scope.submitting = false;

        $http.get(apiConfig.host + "/admin/api/stockOut/send/" + $scope.stockOutId)
            .success(function (data, status) {
                $scope.stockOutForm = data;

                $scope.stockOutForm.stockOutType = data.stockOutType.value;

                angular.forEach(data.stockOutItems, function(v, k) {
                    if (v.stockOutItemStatusValue == 1) {
                        $scope.stockOutItems.push(v);
                    }
                });

                $scope.stockOutForm.receiveAmount = data.amount;
                // $scope.stockOutForm.settle = true;
                $scope.stockOutForm.settle = false;

                if ($scope.stockOutForm.receiveAmount <= 0) {
                    //$scope.isReceiveAmountLessZero = true;
                    $scope.stockOutForm.settle = true;
                }

                // $http.get(apiConfig.host + "/admin/api/accounting/payment/methods/" + data.cityId)
                //     .success(function (methodData) {
                //         $scope.methods = methodData;

                //         angular.forEach($scope.methods, function(method, key) {
                //             if (method.cash) {
                //                 $scope.cashMethod = method.id;
                //             }
                //         });

                //         $scope.add($scope.stockOutForm.receiveAmount);
                //     });
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取出库单信息失败");
                return;
            });

        $http.get(apiConfig.host + "/admin/api/sellReturn/reasons")
            .success(function (data, status) {
                $scope.reasons = data;
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取退货原因失败");
            });

        $scope.changeReceiveAmount = function() {
            $scope.stockOutForm.receiveAmount = $scope.stockOutForm.amount;

            angular.forEach($scope.stockOutItems, function(value, key) {
                if (value.returnQuantity) {
                    $scope.stockOutForm.receiveAmount = $scope.stockOutForm.receiveAmount - value.returnQuantity * value.price;
                }
            });

            $scope.stockOutForm.receiveAmount = parseFloat($scope.stockOutForm.receiveAmount.toFixed(2));

            if ($scope.stockOutForm.receiveAmount < 0) {
                $scope.stockOutForm.receiveAmount = 0;
            }

            // if ($scope.collectionments.length === 1) {
            //     $scope.collectionments[0].amount = $scope.stockOutForm.receiveAmount;
            // }
        }

        $scope.$watch('stockOutForm.receiveAmount', function (newVal, oldVal) {
            if (newVal != null) {
                //$scope.isReceiveAmountLessZero = parseFloat(newVal) <= 0 ? true : false;
                $scope.stockOutForm.settle = parseFloat(newVal) <= 0 ? true : false;
            }

            // if($scope.isReceiveAmountLessZero) {
            //     $scope.stockOutForm.settle = true;
            // }
        });

        $scope.add = function(amount) {
			$scope.inserted = {
			    collectionPaymentMethodId: $scope.cashMethod,
			    amount: amount
			};

			$scope.collectionments.push($scope.inserted);
		};

        $scope.remove = function(index) {
            $scope.collectionments.splice(index, 1);
        };

        // 发起退货操作
        $scope.stockOutReceive = function () {
            var stockOutItems = $scope.stockOutItems;

            for (var i=0; i < stockOutItems.length; i++) {
                if (typeof stockOutItems[i].returnQuantity !== "undefined" && stockOutItems[i].returnQuantity != 0) {
                    if (typeof stockOutItems[i].sellReturnReasonId === "undefined" || stockOutItems[i].sellReturnReasonId === null) {
                        ConfirmModalDialogService.AsyncAlert('商品：［' + stockOutItems[i].skuName + '］请选择退货原因！');
                        return;
                    }
                }
            }
            
            // if ($scope.stockOutForm.settle && !$scope.isReceiveAmountLessZero) {
            //     if ($scope.collectionments.length === 0) {
            //         ConfirmModalDialogService.AsyncAlert("请选择收款方式并输入收款金额");
            //         return;
            //     }
                
            //     var pass = true;
            //     var collectionmentAmount = 0;

            //     angular.forEach($scope.collectionments, function(collectionment, key) {
            //         if (pass && collectionment.collectionPaymentMethodId == null) {
            //             ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请选择收款方式');
            //             pass = false;
            //         }
            //         if (pass && !angular.isNumber(collectionment.amount)) {
            //             ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入有效金额');
            //             pass = false;
            //         }
            //         if (pass && collectionment.amount <= 0) {
            //             ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入大于0的金额');
            //             pass = false;
            //         }
            //         if (pass && collectionment.amount.toString().indexOf('.') >= 0 && collectionment.amount.toString().substring(collectionment.amount.toString().indexOf('.')).length > 3) {
            //             ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入最多两位小数金额');
            //             pass = false;
            //         }

            //         if (collectionment.amount != null && typeof collectionment.amount != 'undefined') {
            //             collectionmentAmount += collectionment.amount;
            //         }
            //     });

            //     if (!pass) {
            //         return;
            //     }

            //     if (parseFloat($scope.stockOutForm.receiveAmount) - parseFloat(collectionmentAmount.toFixed(2)) !== 0) {
            //         ConfirmModalDialogService.AsyncAlert('实际收款金额与订单总金额不符！');
            //         return;
            //     }
            // } else {
            //     $scope.collectionments = [];
            // }

            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认完成配送并发起退货？", 
                function() {
                    $scope.submitting = true;
                    $scope.stockOutForm.stockOutId = $stateParams.stockOutId;
                    $scope.stockOutForm.stockOutItems = $scope.stockOutItems;
                    // $scope.stockOutForm.collectionments = $scope.collectionments;
                    $scope.stockOutForm.collectionments = [];

                    $http({
                        url: apiConfig.host + "/admin/api/stockOut/send/finish",
                        method: "POST",
                        data: $scope.stockOutForm,
                        headers: {'Content-Type': 'application/json;charset=UTF-8'}
                    }).success(function (data, status) {
                        $scope.submitting = false;

                        ConfirmModalDialogService.AsyncAlert("操作成功!");

                        $state.go("today-order-list",{statusValue: $scope.backParams});
                    }).error(function (data, status) {
                        $scope.submitting = false;

                        var errMsg = '';
                        if (data != null && data.errmsg != null) {
                            errMsg = "," + data.errmsg;
                        }

                        ConfirmModalDialogService.AsyncAlert("操作失败" + errMsg);
                    });
                }
            );
        }

    });
angular.module('logisticsApp')
    .factory('MapService', function ($http, $q, apiConfig, $state) {
	    var service = {};
    
		//保存页面的Model
		service.setViewModel = function (viewModel) {
            service.viewModel = viewModel;
        }

		//获取页面Model
        service.getViewModel = function () {
            return service.viewModel;
        }
        
        //删除页面Model
        service.delViewModel = function (){
        	service.viewModel = null;
        } 
        
        
        //定位是否成功
        service.getPointState = function (){
        	return service.pointState;
        }
        
        //定位时间
        service.getPointTime = function () {
        	return service.pointTime;
        }
        
        service.geolocation = function (callback){
			var currtime = (new Date()).valueOf();
			if(service.point == undefined || service.pointTime +  1800000 <  currtime){
				//需要定位
				service.position(callback);
			}else{
				//不需要定位
				if(callback != undefined)
					callback();
			}
        }
        
        //定位数据
        service.position = function (callback){
			var geolocation = new BMap.Geolocation();

			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					service.pointTime = new Date().valueOf(); //记录时间
					service.point = r.point; //记录坐标
					service.pointState = 1; //成功
				}else{
					service.pointState = 2; //失败
					alert("定位失败请重试!");
				}
				if(callback != undefined)
					callback(); 

 			},{enableHighAccuracy: true})
        }

        return service;
    });

'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:RedressLocationCtrl
 * @description
 * # RedressLocationCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
	.controller('RedressLocationCtrl', function($scope, $stateParams, MapService, ConfirmModalDialogService, OrderGroupService) {

		$scope.backParams = $stateParams.backParams;

		var order = OrderGroupService.getRestaurantInfo();

		if (typeof order != "undefined") {
			$scope.orderId = order.id;
			$scope.restaurantId = order.restaurant.id;
			$scope.restaurantName = order.restaurant.name;
			$scope.receiver = order.restaurant.receiver;
			$scope.restaurantTel = order.restaurant.telephone;
			$scope.restaurantAddress = order.restaurant.address.address;
			$scope.lat = order.restaurant.address.wgs84Point.latitude;
			$scope.lng = order.restaurant.address.wgs84Point.longitude;
		} else {
			ConfirmModalDialogService.AsyncAlert("程序异常，请返回重试");
			return;
		}

		$scope.restaurantNewAddress = $scope.restaurantAddress || null;

		// 创建地图对象
		var map = new BMap.Map("allmap");

		if ($scope.lat && $scope.lng) {
			var lat = $scope.lat;
			var lng = $scope.lng;

			$scope.latlng = lat +","+ lng;

			map.centerAndZoom(new BMap.Point(lng,lat), 18);
			map.setCenter(new BMap.Point(lng,lat));
		} else {
			ConfirmModalDialogService.AsyncAlert("该餐馆暂无坐标无法正常显示");
			return;
		}

		// 添加带有定位的导航控件
		// var navigationControl = new BMap.NavigationControl({
		//     // 靠左上角位置
		//     anchor: BMAP_ANCHOR_TOP_LEFT,
		//     // LARGE类型
		//     type: BMAP_NAVIGATION_CONTROL_LARGE,
		//     // 启用显示定位
		//     enableGeolocation: true
		// });
		
		// map.addControl(navigationControl);

		// // 添加定位控件
		// var geolocationControl = new BMap.GeolocationControl();

		// geolocationControl.addEventListener("locationSuccess", function(e){
		//     // 定位成功事件
		//     // console.log(e.point.lat+","+e.point.lng);

		//     $scope.latlng = e.point.lat+","+e.point.lng;
		//     $scope.$apply();
		// });

		// geolocationControl.addEventListener("locationError",function(e){
		//     // 定位失败事件
		//     ConfirmModalDialogService.AsyncAlert(e.message);
		// });
		
		// map.addControl(geolocationControl);

		MapService.geolocation(geoCallback());

		// 定位回调
		function geoCallback() {
			map.addEventListener("dragend", function(){
				// console.log(map.getCenter().lat+","+map.getCenter().lng);

 				$scope.latlng = map.getCenter().lat+","+map.getCenter().lng;

 				$scope.$apply();
 			});
 		};

 		$scope.redressLocation = function () {
 			ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认发起修正位置的工单？", 
                function() {
                	var lat = map.getCenter().lat;
                	var lng = map.getCenter().lng;
                	var restaurantId = $scope.restaurantId;
                	var restaurantName = $scope.restaurantName;
                	var userName = window.sessionStorage['userRealName'];
                	var userTelephone = window.sessionStorage['userTelephone'];

                	var arr = {
					    "username": userName,
					    "restaurantInfo": {
					    	"userTelephone": userTelephone,
					    	"orderId": $scope.orderId,
					    	"restaurantId": restaurantId,
					    	"restaurantName": restaurantName,
					    	"receiver": $scope.receiver,
					    	"restaurantTel": $scope.restaurantTel,
					    	"restaurantAddress": $scope.restaurantAddress,
					    	"restaurantNewAddress": $scope.restaurantNewAddress,
					    	"lat": lat,
					    	"lng": lng
					    }
					};

					arr = JSON.stringify(arr);
            		arr = encodeURIComponent(arr);

                    // window.location.replace("http://cgwy123.avosapps.com/newTicket?data=" + arr); //测试
                    window.location.replace("http://www.canguanwuyou.cn/ticket/newTicket?data=" + arr);  //线上
                }
            );
 		};

 	});
'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:TodayOrderDetailCtrl
 * @description
 * # TodayOrderDetailCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('TodayOrderDetailCtrl', function($scope, $stateParams, $http, $state, apiConfig, ConfirmModalDialogService, OrderGroupService) {

    	$scope.backParams = $stateParams.backParams;
    	$scope.isConfirmProcess = true;

    	$scope.stockOutForm = {};
    	$scope.cashMethod = null;
    	$scope.stockOutItems = [];
    	$scope.collectionments = [];

    	if ($stateParams.orderId) {
    		$http.get(apiConfig.host + "/admin/api/v2/orderGroups/" + $stateParams.orderId)
    			.success(function (data, status) {
    				$scope.order = data;

    				$scope.isConfirmProcess = false;

    				// $http.get(apiConfig.host + "/admin/api/accounting/payment/methods/" + data.cityId)
		      //           .success(function (data) {
		      //               $scope.methods = data;

		      //               angular.forEach($scope.methods, function(method, key) {
		      //                   if (method.cash) {
		      //                       $scope.cashMethod = method.id;
		      //                   }
		      //               });

		      //               $scope.add($scope.order.total);
		      //           });	
    			})
    			.error(function (data, status) {
    				ConfirmModalDialogService.AsyncAlert("获取订单详情失败");

    				$scope.isConfirmProcess = false;
    			});
    	}

    	$scope.add = function(amount) {
			$scope.inserted = {
			    collectionPaymentMethodId: $scope.cashMethod,
			    amount: amount
			};

			$scope.collectionments.push($scope.inserted);
		};

        $scope.remove = function(index) {
            $scope.collectionments.splice(index, 1);
        };

        $scope.toRedressLocation = function () {
        	OrderGroupService.setRestaurantInfo($scope.order);

        	$state.go("redress-location", {backParams: $scope.backParams});
        }

    	$scope.toConfirmYesNo = function (order, telephone) {
		    var $confirm = $("#modalConfirmYesNo");
		    $confirm.modal('show');
		    
		    if (telephone === 0) {
		    	$("#lblMsgConfirmYesNo").html("确认已配送完成？");
		    }
		    if (order === 0) {
		    	$("#lblMsgConfirmYesNo").html("确认拨打电话：" + telephone);
		    }

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		    });

		    $("#btnYesConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");

		        if (telephone === 0) {
		        	// if ($scope.collectionments.length === 0) {
	          //           ConfirmModalDialogService.AsyncAlert("请选择收款方式并输入收款金额");
	          //           return;
	          //       }

	          //       var pass = true;
	          //       var collectionmentAmount = 0;

	          //       angular.forEach($scope.collectionments, function(collectionment, key) {
	          //           if (pass && collectionment.collectionPaymentMethodId == null) {
	          //               ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请选择收款方式');
	          //               pass = false;
	          //           }

	          //           if (pass && !angular.isNumber(collectionment.amount)) {
	          //               ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入有效金额');
	          //               pass = false;
	          //           }

	          //           if (pass && collectionment.amount <= 0) {
	          //               ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入大于0的金额');
	          //               pass = false;
	          //           }

	          //           if (pass && collectionment.amount.toString().indexOf('.') >= 0 && collectionment.amount.toString().substring(collectionment.amount.toString().indexOf('.')).length > 3) {
	          //               ConfirmModalDialogService.AsyncAlert('方式' + (key+1) + '请输入最多两位小数金额');
	          //               pass = false;
	          //           }

	          //           if (collectionment.amount != null && typeof collectionment.amount != 'undefined') {
	          //               collectionmentAmount += collectionment.amount;
	          //           }
	          //       });

	          //       if (!pass) {
	          //           return;
	          //       }

	          //       if (parseFloat($scope.order.total) - parseFloat(collectionmentAmount.toFixed(2)) !== 0) {
	          //           ConfirmModalDialogService.AsyncAlert('实际收款金额与订单总金额不符！');
	          //           return;
	          //       }

	                // 发起完成配送请求
		        	$scope.isConfirmProcess = true;

		        	$scope.stockOutForm.stockOutId = $stateParams.orderId;
		        	$scope.stockOutForm.settle = false;//true
		        	$scope.stockOutForm.receiveAmount = $scope.order.total;

		        	for (var i=0; i < $scope.order.orderItems.length; i++) {
		        		var orderItem = $scope.order.orderItems[i];

		        		$scope.stockOutItems.push({
		        			stockOutItemId: orderItem.id
		        		});
		        	}

		            $scope.stockOutForm.stockOutItems = $scope.stockOutItems;
		            // $scope.stockOutForm.collectionments = $scope.collectionments;
		            $scope.stockOutForm.collectionments = [];

		            $http({
		                url: apiConfig.host + "/admin/api/stockOut/send/finish",
		                method: "POST",
		                data: $scope.stockOutForm,
		                headers: {'Content-Type': 'application/json;charset=UTF-8'}
		            }).success(function (data, status) {
		            	$scope.isConfirmProcess = false;

		                ConfirmModalDialogService.AsyncAlert("操作成功!");

		                $state.go("today-order-list",{statusValue: $scope.backParams});
		            }).error(function (data, status) {
		            	$scope.isConfirmProcess = false;

		                var errMsg = '';
		                if (data != null && data.errmsg != null) {
		                    errMsg = "," + data.errmsg;
		                }
		                
		                ConfirmModalDialogService.AsyncAlert("操作失败" + errMsg);
		            });
		        }
		     
		        if (order === 0) {
		        	window.open('tel:' + telephone, '_system');
		        }
		    });
		};

		$scope.toStockOut = function () {
			ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认发起退货操作？", 
                function() {
                	$state.go("stockOut-receive",{stockOutId: $stateParams.orderId, backParams: $scope.backParams});
                }
            );
		}

    });

'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:TodayOrderListCtrl
 * @description
 * # TodayOrderListCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('TodayOrderListCtrl', function($scope, $http, $stateParams, apiConfig, OrderGroupService, ConfirmModalDialogService) {

        $scope.subTotal = 0;

    	OrderGroupService.getOrderGroups().then(function (data) {
    		$scope.orderGroups = data;
            $scope.displayOrderGroups = [];

            if ($stateParams.statusValue && $stateParams.statusValue === 2) {
                $scope.backParams = $stateParams.statusValue;
                $scope.isDeliverOrderGroups = false;

                if ($scope.orderGroups && $scope.orderGroups.length > 0) {
                    for (var i=0; i < $scope.orderGroups.length; i++) {
                        if ($scope.orderGroups[i].status.value === 2) {
                            $scope.displayOrderGroups.push($scope.orderGroups[i]);
                            $scope.subTotal += $scope.orderGroups[i].total;
                        }
                    }
                    // console.log($scope.displayOrderGroups.length);
                }
            } else {
                $scope.backParams = 0;
                $scope.isDeliverOrderGroups = true;

                if ($scope.orderGroups && $scope.orderGroups.length > 0) {
                    for (var i=0; i < $scope.orderGroups.length; i++) {
                        if ($scope.orderGroups[i].status.value !== 2) {
                            $scope.displayOrderGroups.push($scope.orderGroups[i]);
                            $scope.subTotal += $scope.orderGroups[i].total;
                        }
                    }
                    // console.log($scope.displayOrderGroups.length);
                }
            }
    	});

    	$scope.toConfirmYesNo = function (telephone) {
		    var $confirm = $("#modalConfirmYesNo");
		    $confirm.modal('show');
		    $("#lblMsgConfirmYesNo").html("确认拨打电话：" + telephone);

		    $("#btnNoConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");
		    });
		    $("#btnYesConfirmYesNo").off('click').click(function () {
		        $confirm.modal("hide");

		        window.open('tel:' + telephone, '_system');
		    });
		};

        $http.get(apiConfig.host + "/admin/api/admin-user/me")
            .success(function (data, status) {
                $scope.cityName = data.cities[0].name;
                // console.log($scope.cityName);
            })
            .error(function (data, status) {
                ConfirmModalDialogService.AsyncAlert("获取登录用户失败");
            })

		$scope.toNavigate = function (address) {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确认开启百度地图导航？", 
                function() {
                    if (address.wgs84Point) {
                        var des_lng = address.wgs84Point.longitude; //经度
                        var des_lat = address.wgs84Point.latitude; //纬度

                        // var geolocation = new BMap.Geolocation();
                        // geolocation.getCurrentPosition(function(r) {
                        //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        //         // 调起web浏览器百度地图
                        //         window.location.href = "http://api.map.baidu.com/direction?origin=latlng:"+ r.point.lat +","+ r.point.lng +"|name:我的位置&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region=北京&origin_region=北京&destination_region=北京&output=html&src=logisticsApp";
                        //     } else {
                        //         window.alert("定位失败，请手动输入您的当前位置");
                        //         window.location.href = "http://api.map.baidu.com/direction?origin=&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region=北京&origin_region=北京&destination_region=北京&output=html&src=logisticsApp";
                        //     }
                        // },{enableHighAccuracy: true});

                        var ua = navigator.userAgent.toLowerCase();

                        if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1 
                                || (ua.indexOf('Safari') != -1 && ua.indexOf('Chrome') == -1)) {
                            // 调起iOS百度地图
                            var geolocation = new BMap.Geolocation();
                            geolocation.getCurrentPosition(function(r) {
                                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                    // 调起web浏览器百度地图
                                    // window.location.href = "http://api.map.baidu.com/direction?origin=latlng:"+ r.point.lat +","+ r.point.lng +"|name:我的位置&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region=北京&origin_region=北京&destination_region=北京&output=html&src=logisticsApp";
                                    window.location.href = "baidumap://map/direction?origin=latlng:"+ r.point.lat +","+ r.point.lng +"|name:我的位置&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region="+$scope.cityName+"&origin_region="+$scope.cityName+"&destination_region="+$scope.cityName;
                                } else {
                                    window.alert("定位失败，请手动输入您的当前位置");
                                    // window.location.href = "http://api.map.baidu.com/direction?origin=&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region=北京&origin_region=北京&destination_region=北京&output=html&src=logisticsApp";
                                    window.location.href = "baidumap://map/direction?origin=&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region="+$scope.cityName+"&origin_region="+$scope.cityName+"&destination_region="+$scope.cityName;
                                }
                            },{enableHighAccuracy: true});

                            // window.location.href = "baidumap://map/direction?origin=&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region="+$scope.cityName+"&origin_region="+$scope.cityName+"&destination_region="+$scope.cityName;
                        } else {
                            // 调起Android百度地图
                            window.location.href = "bdapp://map/direction?origin=&destination=latlng:"+ des_lat +","+ des_lng +"|name:"+ address.address +"&mode=driving&region="+$scope.cityName+"&origin_region="+$scope.cityName+"&destination_region="+$scope.cityName;
                        }
                    } else {
                        ConfirmModalDialogService.AsyncAlert("该餐馆暂未添加坐标，无法进行导航！");
                    }
                } 
            );
		}

    });

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