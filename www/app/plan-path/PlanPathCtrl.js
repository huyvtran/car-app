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

        var mapPointAllArray = [];
        var mapPointArray = [];
        var mapTitleAllArray = [];
        var driving;
        var map = new BMap.Map("allmap");

        $scope.page = {
            itemsPerPage : 8,
            currentPage : 1,
            curPageSize :8
        };



        //获取司机所在的经纬度
        OrderGroupService.getLntLat().then(function(data){

            var warehousePoint = new BMap.Point(data.longitude,data.latitude);
            var houseName = data.name;
            /*mapTitleAllArray.push(houseName);*/
            OrderGroupService.getLoad(data.longitude,data.latitude).then(function (data) {

                if(data != null){
                    // 创建地图对象，已登录经纬为中心点
                    $scope.order = data;
                    if ($scope.order && $scope.order.length != 0) {
                        $scope.order.forEach(function (order) {
                            mapPointAllArray.push(new BMap.Point(order.restaurant.address.wgs84Point.longitude,order.restaurant.address.wgs84Point.latitude));
                            mapTitleAllArray.push(order.restaurant.name);
                        })

                        $scope.pageShow(0);
                        map.addControl(new BMap.NavigationControl());
                        map.setViewport(mapPointArray);
                        map.centerAndZoom(warehousePoint, 11);
                        driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                        driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
                        driving.search(warehousePoint, mapPointArray[mapPointArray.length-1], {waypoints:mapPointArray}); //waypoints表示途经点
                        driving.setSearchCompleteCallback(showLabs);
                    }

                    $scope.totalPointArray = mapPointAllArray.length;
                    $scope.page.totalItems = mapPointAllArray.length;


                    //
                    //var centerPoint = new BMap.Point(houseLgt,houseLat);
                    //
                    //
                    //
                    //var centerPointM = new BMap.Marker(centerPoint);//图标
                    //map.addOverlay(centerPointM);
                    //var lab = new BMap.Label(houseName,{position:centerPoint});//添加标注
                    //lab.setStyle({
                    //    color : "red",
                    //    fontSize : "12px",
                    //    height : "20px",
                    //    lineHeight : "20px",
                    //    fontFamily:"微软雅黑"
                    //});
                    //map.addOverlay(lab);//讲标注添加到地图上
                    //
                    ////mapPointArray.push(centerPoint);
                    //map.centerAndZoom(centerPoint,18);
                    //
                    //$scope.order = data;
                    //if ($scope.order && $scope.order.length != 0) {
                    //
                    //    $scope.order.forEach(function (order) {
                    //        console.log(order);
                    //        var myP = new BMap.Point(order.restaurant.address.wgs84Point.longitude,order.restaurant.address.wgs84Point.latitude);
                    //        console.log(myP);
                    //        mapPointArray.push(myP);
                    //        var m = new BMap.Marker(myP);//图标
                    //        map.addOverlay(m);
                    //        var lab = new BMap.Label(order.restaurant.name,{position:myP});//添加标注
                    //        //讲标注添加到地图上
                    //        lab.setStyle({
                    //            color : "red",
                    //            fontSize : "12px",
                    //            height : "20px",
                    //            lineHeight : "20px",
                    //            textline : "center",
                    //            fontFamily:"微软雅黑"
                    //        });
                    //        map.addOverlay(lab);
                    //    })
                    //
                    //
                    //    map.setViewport(mapPointArray);
                    //
                    //    for(var i=0;i<mapPointArray.length;i++){
                    //        var driving = new BMap.DrivingRoute(map);
                    //        driving.search(mapPointArray[i], mapPointArray[i+1])
                    //    }
                    //
                    //
                    //
                    //    /*var polyline = new BMap.Polyline(mapPointArray, {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
                    //    map.addOverlay(polyline);     //添加折线到地图上*!/*/
                    //
                    //} else {
                    //
                    //    return;
                    //}

                }else{
                    ConfirmModalDialogService.AsyncAlert("暂时没有行车路线，请返回！");
                }


            });

        })


        $scope.pageShow = function (num) {
            var pageOn;
            var mapArray = [];
            if(num === 0){
                pageOn = 0;

            }else{
                pageOn = $scope.page.currentPage-1;
            }
            var pageSize = 8 * pageOn > mapPointAllArray.length ? mapPointAllArray.length  : 8 * $scope.page.currentPage ;
            mapPointArray = [];
            for(var i=pageOn * 8; i< pageSize; i++){
                mapPointArray[i] = mapPointAllArray[i];
                mapArray[i] = mapPointAllArray[i];
                var lab = new BMap.Label(i+":"+mapTitleAllArray[i],{position:mapPointArray[i]});//添加标注
                lab.setOffset(new BMap.Size(-10, -50));
                map.addOverlay(lab);
            }
            console.log(mapArray);
            driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
            driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
            driving.search(mapArray, mapArray[mapArray.length-1], {waypoints:mapArray}); //waypoints表示途经点
        }

        function showLabs(){

        }


    });