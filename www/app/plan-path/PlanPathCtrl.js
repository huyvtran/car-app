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
        var warehousePoint;
        var startPoint;
        var endPoint;
        var driving;
        var map = new BMap.Map("allmap");

        $scope.page = {
            itemsPerPage: 8,
            currentPage: 1,
            curPageSize: 8
        };

      //获取司机所在的经纬度
        OrderGroupService.getLntLat().then(function (data) {

            warehousePoint = new BMap.Point(data.longitude, data.latitude);
            var houseName = data.name;
            
            if(data){
                OrderGroupService.getLoad(data.longitude, data.latitude).then(function (data) {

                if (data) {
                    // 创建地图对象，已登录经纬为中心点
                    $scope.order = data;
                    if ($scope.order && $scope.order.length != 0) {
                        $scope.order.forEach(function (order) {
                            mapPointAllArray.push(new BMap.Point(order.restaurant.address.wgs84Point.longitude, order.restaurant.address.wgs84Point.latitude));
                            mapTitleAllArray.push(order.restaurant.name);
                        })

                        map.addControl(new BMap.NavigationControl());
                        driving = new BMap.DrivingRoute(map, {renderOptions: {map: map, autoViewport: false}});
                        driving.setPolicy(BMAP_DRIVING_POLICY_LEAST_TIME);
                        $scope.pageShow();
                        map.setViewport(mapPointArray);
                        map.centerAndZoom(warehousePoint, 11);
                    }

                    $scope.totalPointArray = mapPointAllArray.length;
                    $scope.page.totalItems = mapPointAllArray.length;



                } else {
                    ConfirmModalDialogService.AsyncAlert("暂时没有行车路线，请返回！");
                }


                });
            }else{
                ConfirmModalDialogService.AsyncAlert("没有司机坐标请重新定位！");
            }
            

        })


        $scope.pageShow = function () {

            map.clearOverlays();
            mapPointArray = [];
            var pageOn = $scope.page.currentPage;
            var pageMaxSize = 8 * pageOn > mapPointAllArray.length ? mapPointAllArray.length : 8 * pageOn;
            var index = 0;
            for (var i = (pageOn - 1) * 8; i < pageMaxSize; i++) {

                if(i == pageMaxSize - 1){
                    endPoint = mapPointAllArray[i];
                }else{
                    mapPointArray[index] = mapPointAllArray[i];
                }

                var lab = new BMap.Label(mapTitleAllArray[i], {position: mapPointAllArray[i]});//添加标注
                lab.setOffset(new BMap.Size(-10, -50));
                map.addOverlay(lab);
                index ++;

            }
            //driving.clearResults();
            startPoint = pageOn == 1 ? warehousePoint : mapPointAllArray[(pageOn - 1) * 8 - 1];

            if(pageOn != 1){
                var lab = new BMap.Label(mapTitleAllArray[(pageOn - 1) * 8 - 1], {position: startPoint});//添加标注
                lab.setOffset(new BMap.Size(-10, -50));
                map.addOverlay(lab);
            }
            driving.search(startPoint, endPoint, {waypoints: mapPointArray}); //waypoints表示途经点
        }


    });