angular.module('logisticsApp')
    .controller('ProfileCtrl', function ($scope,$http ,$timeout,$rootScope,$stateParams, MapService, ConfirmModalDialogService, $state,OrderGroupService,apiConfig) {
        /*版本更新*/

        if (ionic.Platform.isWebView() || ionic.Platform.isIOS()) {
            document.addEventListener("deviceready", function () {
                cordova.getAppVersion.getVersionNumber(function (version) {
                    // console.log(version);
                    $scope.currentVersion = version;
                });

            }, false);
        } else {
            $scope.currentVersion = null;
        }

        $scope.checkVersion = function () {
            var toast = document.getElementById('versionToast');
            toast.style.width = "40%";
            toast.style.left = "30%";
            toast.innerHTML = "当前已经是最新版本";
            toast.className = 'fadeIn animated';
            $timeout(function () {
                toast.className = 'hide';
            }, 2000)
        }


        // 退出登录
        $scope.logout = function () {
            ConfirmModalDialogService.AsyncConfirmYesNo(
                "确定退出登录？",
                function() {
                    $http({
                        url: apiConfig.host + "/admin/api/logout",
                        method: 'GET'
                    })
                        .success(function (data, status) {

                            delete $rootScope.user;

                            window.localStorage.removeItem('cachedUsername');
                            window.localStorage.removeItem('password');

                            window.sessionStorage.removeItem('userRealName');
                            window.sessionStorage.removeItem('nameame');
                            window.sessionStorage.removeItem('userTelephone');
                            $state.go("login");
                        })
                        .error(function (data, status) {
                            ConfirmModalDialogService.AsyncAlert("退出异常");
                        })
                }
            );
        }


    });
