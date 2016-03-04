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
