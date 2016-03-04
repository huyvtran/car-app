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