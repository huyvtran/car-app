'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:RedressLocationCtrl
 * @description
 * # RedressLocationCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('PlanPathCtrl', function ($scope, $stateParams, MapService, ConfirmModalDialogService, OrderGroupService) {

        //获取司机所在的经纬度

        OrderGroupService.getLntLat().then(function(data){

            var houseLgt,houseLat;
            var mapPointArray = [];

            houseLgt = data.longitude;
            houseLat = data.latitude;

            var map = new BMap.Map("allmap");
            var centerPoint = new BMap.Point(houseLgt,houseLat);
            mapPointArray.push(centerPoint);
            console.log(centerPoint);
            map.centerAndZoom(centerPoint,18);

            //OrderGroupService.getLoad(houseLgt,houseLat).then(function (data) {
            //    console.log(data);
            //
            //    // 创建地图对象，已登录经纬为中心点
            //
            //
            //
            //    //$scope.order = data;
            //    //console.log(data);
            //    //
            //    //if ($scope.orde && $scope.order.length != 0) {
            //    //
            //    //    $scope.order.forEach(function (order) {
            //    //        var myP = new BMap.Point(order.restaurant.address.wgs84Point.longitude,order.restaurant.address.wgs84Point.latitude);
            //    //        mapPointArray.push(myP);
            //    //        var m = new BMap.Marker(myP);//图标
            //    //        map.addOverlay(m);
            //    //        var lab = new BMap.Label(order.restaurant.name,{position:myP});//添加标注
            //    //        map.addOverlay(lab);//讲标注添加到地图上
            //    //
            //    //    })
            //    //
            //    //    var polyline = new BMap.Polyline(mapPointArray, {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});  //定义折线
            //    //     map.addOverlay(polyline);     //添加折线到地图上*/
            //    //} else {
            //    //
            //    //    return;
            //    //}
            //
            //
            //});

        })






    });