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