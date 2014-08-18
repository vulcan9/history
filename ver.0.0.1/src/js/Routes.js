'use strict';

define([
		'App', //생성한 앵귤러 모듈에 루트를 등록하기 위해 임포트
		'RouteConfig' //루트를 등록하는 routeConfig를 사용하기 위해 임포트
	],

	function (App, routeConfig) {
	
		
		//app은 생성한 App 앵귤러 모듈
		return App.config( function ($routeProvider) {
			
			// routeConfig.config(templatePath, controllerPath, lazyResources)

		        //-----------------------------------
		        // VIEW
		        //-----------------------------------
			
			$routeProvider.when(
				'/application',
				routeConfig.config(
					// requireJS.config의 paths에 등록해놓고 사용해도 됨
					//  paths:{'view1':'./templates/view1.html'}
					// 'view1'로 사용
					_PATH.TEMPLATE + 'application.html', 
					_PATH.CONTROLLER + 'ApplicationController', 
					{
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [
							_PATH.DIRECTIVE  + 'version',
							_PATH.DIRECTIVE  + 'menu'
						], 
						//filters: [_PATH.FILTER + 'reverse'],
						services: []
					}
				)
			);
			
			/*
			//grid 경로 설정
			$routeProvider.when(
				'/grid', 
				routeConfig.config(
					'./templates/grid.html', 
					'./js/controllers/grid'
				)
			);
			*/
			
		        //-----------------------------------
		        // LOGIN 경로 설정
		        //-----------------------------------
			/*
			$routeProvider.when(
				'/login', 
				routeConfig.config(
					'./templates/view2.html', 
					'./js/controllers/second', 
					{
						directives: ['./js/directives/version'], 
						services: ['./js/services/tester'], 
						filters: []
					}
				)
			);
			
		        //-----------------------------------
		        // ADMIN
		        //-----------------------------------
			
			$routeProvider.when(
				'/admin', 
				routeConfig.config(
					'./templates/admin.html', 
					'./js/controllers/AdminController'
				)
			); 
			*/
		        //-----------------------------------
		        // DEFAULT
		        //-----------------------------------
			
			// 기본 경로 설정
			$routeProvider.otherwise({redirectTo:'/application'});
			
		});
	}
);
