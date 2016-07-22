angular.module('logisticsApp')
	.factory('OrderGroupService', function ($http, apiConfig) {

		var service = {};

		service.getOrderGroups = function () {
			return $http({
				url: apiConfig.host + "/admin/api/v2/orderGroups/",
				method: "GET"
			}).then(function (payload) {
				return payload.data;
			})
		};

		service.getLntLat = function(){

			return $http({
				url: apiConfig.host + "/admin/api/v2/orderGroupPoint",
				method: "GET",
			}).then(function (payload) {
				return payload.data;
			})

		}
		service.getLoad = function(houseLgt,houseLat){
			return $http({
				url: apiConfig.host + "/admin/api/v2/orderGroupsApp",
				method: "GET",
				params:{lon:houseLgt,lat:houseLat}
			}).then(function (payload) {
				return payload.data;
			})

		}

		service.getUserId = function(){
			return $http({
				url: apiConfig.host + "/admin/api/admin-user/me",
				method: "GET",
			}).then(function (payload) {
				return payload.data;
			})
		}

		service.setRestaurantInfo = function (order) {
			service.order = order; 
		}

		service.getRestaurantInfo = function () {
			return service.order; 
		}

		return service;
	});