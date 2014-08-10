'use strict';

define([
		'App', //생성한 앵귤러 모듈에 루트를 등록하기 위해 임포트
		'RouteConfig' //루트를 등록하는 routeConfig를 사용하기 위해 임포트
	],

	function (App, routeConfig) {
	
		
		//app은 생성한 App 앵귤러 모듈
		return App.config( function ($routeProvider) {
			
			// routeConfig.config(templatePath, controllerPath, lazyResources)

			//view1 경로 설정
			$routeProvider.when(
				'/view1',
				routeConfig.config(
					// requireJS.config의 paths에 등록해놓고 사용해도 됨
					//  paths:{'view1':'./templates/view1.html'}
					// 'view1'로 사용
					_PATH.TEMPLATE + 'view1.html', 
					_PATH.CONTROLLER + 'first', 
					{
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [_PATH.DIRECTIVE  + 'd_version'], 
						services: [], 
						filters: [_PATH.FILTER + 'reverse']
					}
				)
			);
			
			//view2 경로 설정
			$routeProvider.when(
				'/view2', 
				routeConfig.config(
					'./templates/view2.html', 
					'./js/controllers/second', 
					{
						directives: ['./js/directives/d_version'], 
						services: ['./js/services/tester'], 
						filters: []
					}
				)
			);
			
			/*
			//grid 경로 설정
			$routeProvider.when(
				'/grid', 
				routeConfig.config(
					'../templates/grid.html', 
					'controllers/grid'
				)
			);
			*/
			
			/*
			//admin 경로 설정
			$routeProvider.when(
				'/admin', 
				routeConfig.config(
					'../templates/admin.html', 
					'controllers/third'
				)
			); 
			*/

			//기본 경로 설정
			$routeProvider.otherwise({redirectTo:'/view1'});
			
		});
	}
);
