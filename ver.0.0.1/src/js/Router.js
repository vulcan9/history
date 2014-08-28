'use strict';

define( [], function() {


	function Router( application ) {
		this.application = application;
	}

	Router.prototype = {

		config: function() {

			//var self = this;
			var application = this.application;

			//-----------------------------------
			//  html5Mode
			//-----------------------------------

			// configure html5 to get links working on jsfiddle
			// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
			// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
			// false로 설정하는 경우엔 [#hash] 또는 [#/hash] 형태로 링크 건다.
			var $locationProvider = application.$locationProvider;
			application.$locationProvider.html5Mode( false );

			//-----------------------------------
			//  Route
			//-----------------------------------

			var route = this._routes();
			var $routeProvider = application.$routeProvider;

			this._when( route, $routeProvider );

		},

		run: function() {

		},

		/////////////////////////////////////
		//  Route 설정
		/////////////////////////////////////

		// when(path, routeObject);
		// params : $route.current
		// otherwise(params);

		_when: function( routes, $routeProvider ) {

			var self = this;
			var application = this.application;
			var $routeProvider = application.$routeProvider;

			if ( routes !== undefined ) {
				angular.forEach( routes.paths, function( route, path ) {

					var templateUrl = route.templateUrl;
					var resolver = self._dependencyResolver( templateUrl, route.dependencies );
					out( 'templateUrl : ', templateUrl );

					$routeProvider.when(
						path, {
							templateUrl: route.templateUrl,
							resolve: resolver
						}
					);
				} );
			}

			if ( routes.defaultPath !== undefined ) {
				$routeProvider.otherwise( {
					redirectTo: routes.defaultPath
				} );
			}
		},

		_dependencyResolver: function( templateUrl, dependencies ) {

			//if (templateUrl) dependencies.unshift('text!' + templateUrl);

			var definition = {
				resolver: [ '$q', '$rootScope',
					function( $q, $rootScope ) {
						var deferred = $q.defer();

						require( dependencies, function() {
							out( 'LOAD : ', dependencies );
							$rootScope.$apply( function() {
								deferred.resolve();
							} );
						} );

						return deferred.promise;
					}
				]
			}

			return definition;
		},

		_routes: function() {

			var paths = {
				'/': {
					templateUrl: _PATH.TEMPLATE + '404.html',
					dependencies: []
				},
				'/login': {
					templateUrl: _PATH.TEMPLATE + 'login.html',
					dependencies: [
						_PATH.CONTROLLER + 'LoginController'
					]
				},
				'/admin': {
					templateUrl: _PATH.TEMPLATE + 'admin.html',
					dependencies: [
						_PATH.CONTROLLER + 'AdminController'
					]
				},
				'/tool': {
					templateUrl: _PATH.TEMPLATE + 'tool.html',
					dependencies: [
						//_PATH.DIRECTIVE + 'version',
						_PATH.CONTROLLER + 'ToolController'
					]
				}
			};

			var route = {
				defaultPath: '/',
				paths: paths
			};
			return route;
		}



		/////////////////////////////////////
		//  End Prototype
		/////////////////////////////////////
	};



	Router.prototype_old = {

		// $$routeProvider : https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
		config: function() {
			var self = this;
			var application = this.application;

			// configure html5 to get links working on jsfiddle
			// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
			// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
			// false로 설정하는 경우엔 [#hash] 또는 [#/hash] 형태로 링크 건다.
			var $locationProvider = application.$locationProvider;
			application.$locationProvider.html5Mode( false );

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
			$routeProvider.otherwise( {
				templateUrl: _PATH.TEMPLATE + '404.html',
				redirectTo: '/'
			} );

			//-----------------------------------
			// LOGIN 경로 설정
			//-----------------------------------

			$routeProvider.when(
				'/login',
				this.get(
					_PATH.TEMPLATE + 'login.html',
					_PATH.CONTROLLER + 'LoginController', {
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

			//application.$controllerProvider.register('AdminController', AdminController);
			$routeProvider.when(
				'/admin',
				/*
					{
						templateUrl: _PATH.TEMPLATE + 'admin.html',
						controller: 'AdminController'
					}
					/*/
				this.get(
					_PATH.TEMPLATE + 'login.html',
					_PATH.CONTROLLER + 'AdminController', {
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [
							//_PATH.DIRECTIVE  + 'version'
						],
						//filters: [_PATH.FILTER + 'reverse'],
						//services: []
					}
				)
				//*/
			);

			//-----------------------------------
			// Application
			//-----------------------------------

			$routeProvider.when(
				'/tool',

				/*
					(function (){
						console.log('* version : ', version);
						console.log('* this : ', this);
						console.log('* self : ', self);
						//register(version);
						application.$compileProvider.directive.apply(null, version);
						return {
							templateUrl: _PATH.TEMPLATE + 'tool.html',
							controller: 'ToolController'
						}
					})()
					/*/
				this.get(
					_PATH.TEMPLATE + 'tool.html',
					_PATH.CONTROLLER + 'ToolController', {
						// requireJS.config의 paths에 등록해놓고 사용해도 됨
						// directives: ['version']
						directives: [ _PATH.DIRECTIVE + 'version' ],
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

		},

		//현재 시점에서 services는 오직 value 값을 정할때만 사용할 수 있다.
		//Services는 반드시 factory를 사용해야 한다.

		//$provide.value('a', 123);
		//$provide.factory('a', function() { return 123; });
		//application.compileProvider.directive('directiveName', ...);
		//$filterProvider.register('filterName', ...);
		get: function( templatePath, controllerPath, resources, routeObject ) {

			var routeDefinition = angular.extend( {}, routeObject );

			var self = this;
			var application = this.application;
			var $controllerProvider = application.$controllerProvider;

			//컨트롤러 프로바이더가 존재하지 않으면 오류!
			if ( !$controllerProvider ) {
				throw new Error( "$controllerProvider is not set!" );
			}

			//경로 템플릿 설정
			var html;
			routeDefinition.template = function() {
				return html;
			};

			//경로 컨트롤러 설정
			var controllerName = controllerPath.substring( controllerPath.lastIndexOf( "/" ) + 1 );
			routeDefinition.controller = controllerName;

			//경로 
			routeDefinition.resolve = {

				delay: function( $q, $rootScope, $timeout ) {

					//defer 가져오기
					var defer = $q.defer();

					//html에 아무런 값이 없는 경우
					if ( !html ) {

						//템플릿 및 컨트롤러 디펜던시 설정
						var dependencies = [ "text!" + templatePath, controllerPath ];

						//리소스들 추가
						if ( resources ) {
							dependencies = dependencies.concat( resources.directives );
							dependencies = dependencies.concat( resources.services );
							dependencies = dependencies.concat( resources.filters );
						}

						//디펜던시들 가져오기
						require( dependencies, function() {

							//인디케이터
							var indicator = 0;

							//템플릿
							var template = arguments[ indicator++ ];
							html = template;

							//컨트롤러
							if ( angular.isDefined( controllerPath ) ) {
								out( '# Load Controller Path : ', controllerName, ' (', controllerPath, ')' );
								//out(arguments[indicator])

								application.$controllerProvider.register( controllerName, arguments[ indicator ] );
								indicator++;

								out( controllerName, ' :', angular.injector().has( controllerName ) );
							}

							if ( angular.isDefined( resources ) ) {

								//디렉티브
								if ( angular.isDefined( resources.directives ) ) {
									for ( var i = 0; i < resources.directives.length; i++ ) {
										self.registerDirectives( arguments[ indicator ] );
										indicator++;
									}
								}

								//서비스(value)
								if ( angular.isDefined( resources.services ) ) {
									for ( var i = 0; i < resources.services.length; i++ ) {
										self.registerServices( arguments[ indicator ] );
										indicator++;
									}
								}

								//필터
								if ( angular.isDefined( resources.filters ) ) {
									for ( var i = 0; i < resources.filters.length; i++ ) {
										self.registerFilters( arguments[ indicator ] );
										indicator++;
									}
								}
							}

							//딜레이 걸어놓기
							$rootScope.$apply( function() {
								defer.resolve();
							} );

							out( 'TODO : 로딩바 닫기' );
							//out($location.path(), window.location);
							//$location.path(window.location.hash);
						} );

						out( 'TODO : 로딩바 보이기' );
					} else {
						defer.resolve();
					}

					/*
						//$timeout(defer.resolve, 2000);
						$timeout(function (){
							out(controllerName, ' :', angular.injector().has(controllerName), $controllerProvider.register(controllerName));
						},2000);
						*/

					return defer.promise;
				}

			}

			return routeDefinition;
		},

		registerDirectives: function( directive ) {
			var application = this.application;
			var $compileProvider = application.$compileProvider;
			if ( directive ) {
				if ( !$compileProvider ) {
					throw new Error( "$compileProvider is not set!" );
				}
				$compileProvider.directive.apply( null, directive );
			} else {
				$compileProvider.directive.apply = null;
			}
		},

		registerServices: function( service ) {
			var application = this.application;
			var provide = application.$provide;
			if ( service ) {
				if ( !$provide ) {
					throw new Error( "$setProvide is not set!" );
				}
				$provide.value( service[ 0 ], service[ 1 ] );
			} else {
				$provide.value = null;
			}
		},

		registerFilters: function( filter ) {
			var application = this.application;
			var filterProvider = application.$filterProvider;
			if ( filter ) {
				if ( !$filterProvider ) {
					throw new Error( "$setProvide is not set!" );
				}
				$filterProvider.register( filter[ 0 ], filter[ 1 ] );
			} else {
				$filterProvider.register = null;
			}
		},



		// application : $rootScope, $location
		run: function _run() {
			// register listener to watch route changes
			var application = this.application;

			//*
			application.$rootScope.$on( "$routeChangeSuccess", function( event, next, current ) {

				if ( current === undefined ) {
					out( '# 처음 접속' );
					//$location.path('/login'); 
				}
				out( '# 접속 : ', application.$location.path() );

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


				// out('pathParams : ', next.pathParams);
				// out('params : ', next.params);
				// out('template : ', next.template());
				// out('reloadOnSearch : ', next.reloadOnSearch);
			} );
			//*/
		}

		////////////////////////////////
		// END prototype
		////////////////////////////////
	};



	return Router;


	////////////////////////////////////////
	// END
	////////////////////////////////////////
} );