
angular.module('logisticsApp')
    .factory('FeedbackService', function ($http, $q, apiConfig) {
        var service = {};

        service.feedback = function (form) {
            return $http({
                url: apiConfig.host + "/admin/api/carFeedback",
                method: 'POST',
                data: {userId:form.userId,type:form.type,restaurantName:form.restaurantName,feedbackContent: form.content, mediaFileId: form.mediaFileId}
            }).then(function(payload) {
                return payload.data;
            },function (error){
                alert(JSON.stringify(error));
                return null;
            });
        };

        return service;
    })