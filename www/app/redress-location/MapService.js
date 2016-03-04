angular.module('logisticsApp')
    .factory('MapService', function ($http, $q, apiConfig, $state) {
	    var service = {};
    
		//保存页面的Model
		service.setViewModel = function (viewModel) {
            service.viewModel = viewModel;
        }

		//获取页面Model
        service.getViewModel = function () {
            return service.viewModel;
        }
        
        //删除页面Model
        service.delViewModel = function (){
        	service.viewModel = null;
        } 
        
        
        //定位是否成功
        service.getPointState = function (){
        	return service.pointState;
        }
        
        //定位时间
        service.getPointTime = function () {
        	return service.pointTime;
        }
        
        service.geolocation = function (callback){
			var currtime = (new Date()).valueOf();
			if(service.point == undefined || service.pointTime +  1800000 <  currtime){
				//需要定位
				service.position(callback);
			}else{
				//不需要定位
				if(callback != undefined)
					callback();
			}
        }
        
        //定位数据
        service.position = function (callback){
			var geolocation = new BMap.Geolocation();

			geolocation.getCurrentPosition(function(r){
				if(this.getStatus() == BMAP_STATUS_SUCCESS){
					service.pointTime = new Date().valueOf(); //记录时间
					service.point = r.point; //记录坐标
					service.pointState = 1; //成功
				}else{
					service.pointState = 2; //失败
					alert("定位失败请重试!");
				}
				if(callback != undefined)
					callback(); 

 			},{enableHighAccuracy: true})
        }

        return service;
    });
