'use strict';
/**
 * @ngdoc function
 * @name logisticsApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the logisticsApp
 */
angular.module('logisticsApp')
    .controller('FeedbackCtrl', function($rootScope,$scope, $http, $state, $location, apiConfig, OrderGroupService, ConfirmModalDialogService,CameraService, FeedbackService) {


        $scope.form = {
            userId:'',
            type:'',
            restaurantName:'',
            content:'',
            mediaFileId:''
        };

        var originalPath = $location.path();


        $http.get(apiConfig.host + "/admin/api/admin-user/me")
            .success(function (data, status) {
                $scope.form.userId = data.id;

            })

        /*获取司机反馈类型*/
        $scope.types = [];
        $http.get(apiConfig.host + "/admin/api/carFeedbackTypes")
            .success(function (data, status) {
                $scope.types = data;
            })



        $scope.$watch('form.value', selectRegion);
        function selectRegion (value) {
            console.log(value);
            if ($scope.types) {
                for (var i = 0; i < $scope.types.length; i++) {
                    var type = $scope.types[i];
                    if (type.value == value) {
                        $scope.type = type;
                        $scope.cityName = type.name;
                    }
                }
            }
        }

        $scope.$watch('lastPhoto', function(newValue) {
            if (newValue) {
                $scope.isCommitState = false;
            } else if (newValue === "" || newValue === null) {
                $scope.isCommitState = true;
            }
        });

        $scope.$watch('form.content', function(newValue) {
            if (newValue) {
                $scope.isCommitState = false;
            } else if (newValue === "" || newValue === null) {
                $scope.isCommitState = true;
            }
        });

        $scope.uploadFile = function () {
            $upload.upload({
                url: 'http://115.28.64.174:8083/web/admin/api/v2/media',
                method: 'POST',
                file: files[i]
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                $scope.uploadProgress = ('progress: ' + progressPercentage + '% ' + evt.config.file.name);
            }).success(function (data) {
                $scope.mediaUrl = data.url;
                $scope.form.mediaFileId = data.id;
            })
        };

        $scope.upload = function (filePath) {
            if($scope.form.type === "") {
                ConfirmModalDialogService.AsyncAlert("请选择反馈类型");
                return;
            }
            if($scope.form.content === "") {
                ConfirmModalDialogService.AsyncAlert("请填写反馈内容");
                return;
            }
            if (filePath) {
                $scope.isCommitState = true;
                CameraService.upload(filePath).then(function (file) {
                    $scope.form.mediaFileId = file.id;
                    $scope.isCommitState = false;
                    FeedbackService.feedback($scope.form).then(function () {
                        ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                        $scope.form.content = null;
                        $scope.lastPhoto = null;
                        $scope.form.restaurantName = null;
                        $scope.form.type = null;
                        return;
                    });
                }, function (err) {
                    $scope.isCommitState = false;

                    ConfirmModalDialogService.AsyncAlert("反馈失败");
                    return;
                });
            } else {
                FeedbackService.feedback($scope.form).then(function (data) {
                    ConfirmModalDialogService.AsyncAlert("反馈成功，我们会尽快处理");
                    $scope.form.content = null;
                    $scope.form.restaurantName = null;
                    $scope.form.type = null;
                    return;
                });
            }
        };

        $scope.addPicture = function () {
            $('div.action-sheet-backdrop')[0].style.display = "block";
            $scope.showDrop = true;
        };

        $scope.hideBackdrop = function () {
            $('div.action-sheet-backdrop')[0].style.display = "none";
        };

        $scope.buttonClicked = function (index) {
            if (index === 0) {
                CameraService.getPicture({
                    quality: 75,
                    targetWidth: 320,
                    targetHeight: 320,
                    saveToPhotoAlbum: false,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                }).then(function (imageURI) {
                    $scope.lastPhoto = imageURI;

                    $('div.action-sheet-backdrop')[0].style.display = "none";
                })

                return true;
            } else if (index === 1) {
                CameraService.getPicture({
                    quality: 75,
                    targetWidth: 320,
                    targetHeight: 320,
                    saveToPhotoAlbum: false
                }).then(function (imageURI) {
                    $scope.lastPhoto = imageURI;

                    $('div.action-sheet-backdrop')[0].style.display = "none";
                })

                return true;
            }
        };
    });

