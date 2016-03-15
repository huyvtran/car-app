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

            var houseLgt,houseLat,houseName;
            var mapPointArray = [];

            houseLgt = data.longitude;

            houseLat = data.latitude;
            houseName = data.name;


            OrderGroupService.getLoad(houseLgt,houseLat).then(function (data) {

                if(data!=null){
                    // 创建地图对象，已登录经纬为中心点
                    var map = new BMap.Map("allmap");
                    var centerPoint = new BMap.Point(houseLgt,houseLat);
                    var centerPointM = new BMap.Marker(centerPoint);//图标
                    map.addOverlay(centerPointM);
                    var lab = new BMap.Label(houseName,{position:centerPoint});//添加标注
                    lab.setStyle({
                        color : "red",
                        fontSize : "12px",
                        height : "20px",
                        lineHeight : "20px",
                        fontFamily:"微软雅黑"
                    });
                    map.addOverlay(lab);//讲标注添加到地图上

                    mapPointArray.push(centerPoint);
                    map.centerAndZoom(centerPoint,18);

                    $scope.order = data;
                    if ($scope.order && $scope.order.length != 0) {

                        $scope.order.forEach(function (order) {
                            console.log(order);
                            var myP = new BMap.Point(order.restaurant.address.wgs84Point.longitude,order.restaurant.address.wgs84Point.latitude);
                            console.log(myP);
                            mapPointArray.push(myP);
                            var m = new BMap.Marker(myP);//图标
                            map.addOverlay(m);
                            var lab = new BMap.Label(order.restaurant.name,{position:myP});//添加标注
                            //讲标注添加到地图上
                            lab.setStyle({
                                color : "red",
                                fontSize : "12px",
                                height : "20px",
                                lineHeight : "20px",
                                textline : "center",
                                fontFamily:"微软雅黑"
                            });
                            map.addOverlay(lab);
                        })

                        for(var i=0;i<mapPointArray.length;i++){

                            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
                            driving.search(mapPointArray[i], mapPointArray[i+1])
                        }



                        /*var polyline = new BMap.Polyline(mapPointArray, {strokeColor:"blue", strokeWeight:6, strokeOpacity:0.5});  //定义折线
                        map.addOverlay(polyline);     //添加折线到地图上*!/*/

                    } else {

                        return;
                    }

                }else{
                    ConfirmModalDialogService.AsyncAlert("暂时没有行车路线，请返回！");
                }


            });

        })






    });