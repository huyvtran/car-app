angular.module('logisticsApp')
    .factory('CameraService', ['$q','$cordovaFileTransfer','apiConfig', function ($q, $cordovaFileTransfer, apiConfig) {

        // '$cordovaFileTransfer',
        return {
            getPicture: function (options) {
                var q = $q.defer();

                navigator.camera.getPicture(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return q.promise;
            },

            upload: function(filePath) {
                var q = $q.defer();
                document.addEventListener('deviceready', function () {
                    return $cordovaFileTransfer.upload("http://115.28.64.174:8083" + "/api/v2/media", filePath, {
                        fileKey: "file",
                        chunkedMode: false
                    }).then(function(result) {
                        if(result.responseCode === 200) {
                            //return angular.fromJson(result.response);
                            q.resolve(angular.fromJson(result.response));
                        }else{
                            q.reject(err);
                        }
                    },function (error){
                        alert(JSON.stringify(error));
                        return null;
                    });
                }, false);

                return q.promise;
            }
        }
    }]);
