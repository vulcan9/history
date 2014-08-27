'use strict';

define([
		_PATH.CONTROLLER + 'AdminController',
		_PATH.CONTROLLER + 'LoginController',
		//_PATH.CONTROLLER + 'ToolController',

		//_PATH.DIRECTIVE + 'version'
	],
	function( AdminController, LoginController, ToolController, version ) {

// when(path, routeObject);
// params : $route.current
// otherwise(params);


var application;
		// application : $rootScope, $location
		function _run(){
			// register listener to watch route changes
			application.$rootScope.$on("$routeChangeStart", function(event, next, current) {

				if(current === undefined){
					out('#처음 접속');
					//$location.path('/login'); 
				}

				/*
				if ($rootScope.loggedUser == null) {

					// no logged user, we should be going to #login
					if (next.templateUrl == "partials/login.html") {
						// already going to #login, no redirect needed
					} else {
						// not going to #login, we should redirect now
						$location.path("/login");
					}

				}
				*/

				//out('$routeChangeStart : ', current, ' --> ', next);
			});
		}

		// $$routeProvider : https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
		function _config(app){
			application = app;

			// configure html5 to get links working on jsfiddle
			// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
			// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
			var $locationProvider = application.$locationProvider;
			application.$locationProvider.html5Mode(false);

			var $routeProvider = application.$routeProvider;

			/*
			$routeProvider.when(
				'/Book/:bookId',
				{
					templateUrl: 'templates/application.html',
					//controller: 'BookController',
					resolve: {
						// I will cause a 1 second delay
						delay: function($q, $timeout) {
							var delay = $q.defer();
							$timeout(delay.resolve, 1000);
							return delay.promise;
						}
					}
				}
			);

			$routeProvider.when(
				'/Book/:bookId/ch/:chapterId',
				{
					templateUrl: 'templates/menu.html',
					//controller: 'ChapterController'
				}
			);
			*/

			//-----------------------------------
			// DEFAULT
			//-----------------------------------

			// 기본 경로 설정
			$routeProvider.otherwise({
				templateUrl: _PATH.TEMPLATE + '404.html',
				redirectTo: '/'
			});

		        //-----------------------------------
		        // LOGIN 경로 설정
		        //-----------------------------------
			
			$routeProvider.when(
				'/login', 
				get(
					_PATH.TEMPLATE + 'login.html',
					_PATH.CONTROLLER + 'LoginController',
					{
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [
							//_PATH.DIRECTIVE  + 'version'
						], 
						//filters: [_PATH.FILTER + 'reverse'],
						//services: []
					}
				)
			);
			
		        //-----------------------------------
		        // ADMIN
		        //-----------------------------------
			
			$routeProvider.when(
				'/admin', 
				{
					templateUrl: _PATH.TEMPLATE + 'admin.html',
					controller: AdminController
				}
			);
		
		        //-----------------------------------
		        // Application
		        //-----------------------------------
			
			$routeProvider.when(
				'/tool',

				/*
				(function (){
					console.log('* version : ', version);
					//register(version);
					aplication.compileProvider.directive.apply(null, version);
					return {
						templateUrl: _PATH.TEMPLATE + 'tool.html',
						controller: ToolController
					}
				})()
				/*/
				get(
					_PATH.TEMPLATE + 'tool.html',
					_PATH.CONTROLLER + 'ToolController',
					{
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [
							_PATH.DIRECTIVE  + 'version'
						], 
						//filters: [_PATH.FILTER + 'reverse'],
						//services: []
					}
				)
				//*/
			);
			/*
			$routeProvider.when(
				'/viewer',
				{
					templateUrl: _PATH.TEMPLATE + 'viewer.html',
					controller: ViewerController
				}
			);
			*/
		































		/*
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
		*/




		//현재 시점에서 services는 오직 value 값을 정할때만 사용할 수 있다.
		//Services는 반드시 factory를 사용해야 한다.
		
		//$provide.value('a', 123);
		//$provide.factory('a', function() { return 123; });
		//aplication.compileProvider.directive('directiveName', ...);
		//$filterProvider.register('filterName', ...);
		
		function get (templatePath, controllerPath, resources, routeObject) {
			var $controllerProvider = application.$controllerProvider;
		
			//컨트롤러 프로바이더가 존재하지 않으면 오류!
			if (!$controllerProvider) {
				throw new Error("$controllerProvider is not set!");
			}

			//변수 선언
			var defer, html;
			var routeDefinition = angular.extend({}, routeObject);

			//경로 템플릿 설정
			routeDefinition.template = function () {
				return html;
			};
			
			//경로 컨트롤러 설정
			var controllerName = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);
			routeDefinition.controller = controllerName;
			
			//경로 
			routeDefinition.resolve = {
				//key:factory,
			
				delay: function ($q, $rootScope, $timeout, $route, $location) {

					//defer 가져오기
					defer = $q.defer();
					//if(!application.$route) application.$route = $route;



					//html에 아무런 값이 없는 경우
					if (!html) {
					
						//템플릿 및 컨트롤러 디펜던시 설정
						var dependencies = ["text!" + templatePath, controllerPath];
						
						//리소스들 추가
						if (resources) {
							dependencies = dependencies.concat(resources.directives);
							dependencies = dependencies.concat(resources.services);
							dependencies = dependencies.concat(resources.filters);
						}
						
						//디펜던시들 가져오기
						require(dependencies, function () {

							//인디케이터
							var indicator = 0;
					
							//템플릿
							var template = arguments[indicator++];
							
							//컨트롤러
							if( angular.isDefined( controllerPath ) ) {
								$controllerProvider.register(controllerName, arguments[indicator]);
								indicator++;

								out('# Load Controller Path : ', controllerName, ' (', controllerPath, ')');
							}
							
							if( angular.isDefined( resources ) ) {
								
								//다이렉티브
								if( angular.isDefined(resources.directives) ) {
									for(var i=0; i<resources.directives.length; i++) {
										registerDirectives(arguments[indicator]);
										indicator++;
									}
								}
								
								//서비스(value)
								if( angular.isDefined(resources.services) ) {
									for(var i=0; i<resources.services.length; i++) {
										registerServices(arguments[indicator]);
										indicator++;
									}
								}
								
								//필터
								if( angular.isDefined(resources.filters) ) {
									for(var i=0; i<resources.filters.length; i++) {
										registerFilters(arguments[indicator]);
										indicator++;
									}
								}
							}
							
							//딜레이 걸어놓기
							html = template;
							
							$rootScope.$apply(function(){
								defer.resolve();
							});

							
							out('TODO : 로딩바 닫기');
							//out($location.path(), window.location);
							//$location.path(window.location.hash);
						});

						out('TODO : 로딩바 보이기');
					}
					
					else {
						defer.resolve();
					}
					

					//$timeout(defer.resolve, 3000);
					return defer.promise;
				}
			}
			
			return routeDefinition;
		}

		function registerDirectives(directive){
			var $compileProvider = application.$compileProvider;
			if(directive){
				if (!$compileProvider) {
					throw new Error("$compileProvider is not set!");
				}
				$compileProvider.directive.apply(null, directive);
			}else{
				$compileProvider.directive.apply = null;
			}
		}

		function registerServices(service){
			var provide = application.$provide;
			if (service) {
				if (!$provide) {
					throw new Error("$setProvide is not set!");
				}
				$provide.value(service[0], service[1]);
			} else {
				$provide.value = null;
			}
		}

		function registerFilters(filter){
			var filterProvider = application.$filterProvider;
			if(filter){
				if (!$filterProvider) {
					throw new Error("$setProvide is not set!");
				}
				$filterProvider.register(filter[0], filter[1]);
			}else{
				$filterProvider.register = null;
			}
		}
























}

		return {
			config : _config,
			run : _run
		};


	        ////////////////////////////////////////
	        // END
	        ////////////////////////////////////////
	}
);