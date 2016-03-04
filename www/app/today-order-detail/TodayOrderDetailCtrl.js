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
