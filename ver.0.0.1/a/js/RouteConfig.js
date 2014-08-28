
/*
[참고]
AngularJS 와 RequireJS 를 활용한 대규모 웹 어플리케이션 개발
http://jcf.daewoobrenic.co.kr/blog/?p=237
http://programmingsummaries.tistory.com/229
https://github.com/angular/angular-seed
*/

//requireJS 모듈 선언
define([],

	//디펜던시 로드뒤 콜백함수
	function () {


		function RouteConfig(application){
			this.application = application;
		}

		/*
		var $compileProvider;
		var $provide;
		var $filterProvider;
		var $controllerProvider; //컨트롤러 프로바이더를 받을 변수
		*/

		RouteConfig.prototype = {

			
			// lazyDirectives
			registerCompile : function (directive) {
				var application = this.application;
				var $compileProvider = application.$compileProvider;
				if(directive){
					if (!$compileProvider) {
						throw new Error("$compileProvider is not set!");
					}
					$compileProvider.directive.apply(null, directive);
				}else{
					$compileProvider.directive.apply = null;
				}

			},

			// lazyServices
			registerServices : function (service) {
				var application = this.application;
				var provide = application.$provide;
				if (service) {
					if (!$provide) {
						throw new Error("$setProvide is not set!");
					}
					$provide.value(service[0], service[1]);
				} else {
					$provide.value = null;
				}

			},


			// lazyFilters
			registerFilter : function (filter) {
				var application = this.application;
				var filterProvider = application.$filterProvider;
				if(filter){
					if (!$filterProvider) {
						throw new Error("$setProvide is not set!");
					}
					$filterProvider.register(filter[0], filter[1]);
				}else{
					$filterProvider.register = null;
				}

			},


			/*
			//컨트롤러 프로바이더 설정 함수
			setControllerProvider : function (value) {
				$controllerProvider = value;
			},

			//컴파일 프로바이더 설정 함수
			setCompileProvider : function (value) {
				$compileProvider = value;
			},

			//프로바이드 설정 함수
			setProvide : function (value) {
				$provide = value;
			},

			//필터 프로바이더 설정 함수
			setFilterProvider : function (value) {
				$filterProvider = value;
			},
			*/





			//현재 시점에서 services는 오직 value 값을 정할때만 사용할 수 있다.
			//Services는 반드시 factory를 사용해야 한다.
			
			//$provide.value('a', 123);
			//$provide.factory('a', function() { return 123; });
			//$compileProvider.directive('directiveName', ...);
			//$filterProvider.register('filterName', ...);
			
			get : function (templatePath, controllerPath, lazyResources) {
				
				console.log('lazy');

				var self = this;
				var application = this.application;
				var $controllerProvider = application.$controllerProvider;


				//컨트롤러 프로바이더가 존재하지 않으면 오류!
				if (!$controllerProvider) {
					throw new Error("$controllerProvider is not set!");
				}

				//변수 선언
				var defer, html, routeDefinition = {};

				//경로 템플릿 설정
				routeDefinition.template = function () {
					return html;
				};
				
				//경로 컨트롤러 설정
				routeDefinition.controller = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);
				
				//경로 
				routeDefinition.resolve = {
				
					delay: function ($q, $rootScope) {
					
						//defer 가져오기
						defer = $q.defer();
						
						//html에 아무런 값이 없는 경우
						if (!html) {
						
							//템플릿 및 컨트롤러 디펜던시 설정
							var dependencies = ["text!" + templatePath, controllerPath];
							
							//리소스들 추가
							if (lazyResources) {
								dependencies = dependencies.concat(lazyResources.directives);
								dependencies = dependencies.concat(lazyResources.services);
								dependencies = dependencies.concat(lazyResources.filters);
							}
							
							//디펜던시들 가져오기
							require(dependencies, function () {

								//인디케이터
								var indicator = 0;
						
								//템플릿
								var template = arguments[indicator++];
								
								//컨트롤러
								if( angular.isDefined( controllerPath ) ) {
									var controllerName = controllerPath.substring(controllerPath.lastIndexOf("/") + 1);
									$controllerProvider.register(controllerName, arguments[indicator]);
									console.log(controllerName, ' 등록 :', $controllerProvider);
									indicator++;
								}
								
								if( angular.isDefined( lazyResources ) ) {
									
									//다이렉티브
									if( angular.isDefined(lazyResources.directives) ) {
										for(var i=0; i<lazyResources.directives.length; i++) {
											self.registerCompile(arguments[indicator]);
											indicator++;
										}
									}
									
									//서비스(value)
									if( angular.isDefined(lazyResources.services) ) {
										for(var i=0; i<lazyResources.services.length; i++) {
											self.registerServices(arguments[indicator]);
											indicator++;
										}
									}
									
									//필터
									if( angular.isDefined(lazyResources.filters) ) {
										for(var i=0; i<lazyResources.filters.length; i++) {
											self.registerFilters(arguments[indicator]);
											indicator++;
										}
									}
								}
								
								//딜레이 걸어놓기
								html = template;
								
									$rootScope.$apply(function(){
										defer.resolve();
									});
							})
						}
						
						else {
							defer.resolve();
						}
						
						return defer.promise;
					}
				}

				return routeDefinition;
			},




			config : function (){

				var self = this;
				var application = this.application;

				// configure html5 to get links working on jsfiddle
				// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
				// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
				var $locationProvider = application.$locationProvider;
				application.$locationProvider.html5Mode(false);

				var $routeProvider = application.$routeProvider;

				// routeConfig.config(templatePath, controllerPath, lazyResources)

			        //-----------------------------------
			        // VIEW
			        //-----------------------------------
				
				$routeProvider.when(
					'/application',
					this.get(
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						//  paths:{'view1':'./templates/view1.html'}
						// 'view1'로 사용
						_PATH.TEMPLATE + 'application.html', 
						_PATH.CONTROLLER + 'AppController', 
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
				//*
				$routeProvider.when(
					'/login', 
					this.get(
						'./templates/admin.html', 
						'./js/controllers/second', 
						{
							directives: ['./js/directives/version'], 
							services: ['./js/services/tester'], 
							filters: []
						}
					)
				);
				//*/
			        //-----------------------------------
			        // ADMIN
			        //-----------------------------------
				
				$routeProvider.when(
					'/admin', 
					this.get(
						'./templates/admin.html', 
						'./js/controllers/AdminController'
					)
				); 
				
			        //-----------------------------------
			        // DEFAULT
			        //-----------------------------------
				
				// 기본 경로 설정
				$routeProvider.otherwise({redirectTo:'/application'});
				
			}




		};












		

		
		
















		return RouteConfig;
	}
);

