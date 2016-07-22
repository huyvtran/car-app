'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:TodayOrderQueryCtrl
 * @description
 * # TodayOrderQueryCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('TodayOrderQueryCtrl', function($scope,$filter, OrderGroupService, ConfirmModalDialogService) {

    	$scope.deliverOrderCount = 0;
    	$scope.deliverOrderTotal = 0;
        $scope.deliveredOrderCount = 0;
        $scope.deliveredOrderTotal = 0;
        $scope.subTotal = 0;
        $scope.percent = 0;


        var newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);

        $scope.startDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.endDate = $filter('date')(newDate, 'yyyy-MM-dd');

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
                $scope.percent = parseInt(($scope.deliveredOrderCount/$scope.orderGroups.length)*100);
                $scope.circle( $scope.percent);

            }
        });


        $scope.circle = function(percent){
             if( percent <= 50 ){
                    $('.pie_right').css('transform','rotate('+(percent*3.6)+'deg)');
                }else{

                    /*$('.pie_right').css('transform','rotate(180deg)');
                    $('.pie_left').css('transform','rotate('+((50-percent)*3.6)+'deg)');*/

                 $('.circle').css('background','#b1d6e4');
                 $('.pie_left').css({
                     'transform':'rotate('+((50-percent)*3.6)+'deg)',
                     'background':'#31b26b'
                 });
                 $('.pie_right').css({
                     'transform':'rotate(180deg)',
                     'background':'#31b26b'
                 });
             }
        }

    });