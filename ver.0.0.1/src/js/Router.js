/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Route  정의
    *     

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {


	function Router( application ) {
		this.application = application;

		// 공통으로 사용되는 dependancy가 로드 되었는지 체크
		this._isCommonDependancyLoaded = false;
	}

	Router.prototype = {

		config: function() {

			//var self = this;
			var application = this.application;

			//-----------------------------------
			//  html5Mode
			//  https://code.angularjs.org/1.2.23/docs/guide/$location
			//-----------------------------------

			// configure html5 to get links working on jsfiddle
			// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
			// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
			// false로 설정하는 경우엔 [#hash] 또는 [#/hash] 형태로 링크 건다.

			var $locationProvider = application.$locationProvider;
			application.$locationProvider.html5Mode( false );
			//application.$locationProvider.hashPrefix('!');

			//-----------------------------------
			//  Route
			//-----------------------------------

			var routes = this._getRoutes();
			var $routeProvider = application.$routeProvider;

			this._when( routes, $routeProvider );
		},

		run: function() {

			// change the path
			//this.application.$location.path('/login');
			
		},

		/////////////////////////////////////
		//  Route 설정
		/////////////////////////////////////

		// $$routeProvider : https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
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
					var definition = self._getRouteDefinition( templateUrl, route.dependencies );
					//out( 'templateUrl : ', templateUrl );

					$routeProvider.when( path, definition );
				} );
			}

			// DEFAULT
			if ( routes.defaultPath !== undefined ) {
				$routeProvider.otherwise( {
					redirectTo: routes.defaultPath
				} );
			}
		},

		_getRouteDefinition: function( templateUrl, dependencies ) {

			/*
			var definition = {
				// If the option is set to false and url in the browser changes, then $routeUpdate event is broadcasted on the root scope.
				reloadOnSearch          : true,
				caseInsensitiveMatch  : false,
				// template                 : {string=|function()=} 
				templateUrl                 : {string=|function()=},
				// controllerAs            :  {string=} – A controller alias name
				// controller                : {(string|function()=}
				resolve                       : {Object.<string, function>=}
			};
			*/

			var self = this;

			// 한번씩만 로딩
			var loaded = false;

			var definition = {

				templateUrl: templateUrl,

				resolve: [ '$q', '$rootScope',
					function( $q, $rootScope ) {

						var deferred = $q.defer();

						if ( loaded || !dependencies || dependencies.length < 1 ) {
							deferred.resolve();
							return deferred.promise;
						}

						//-----------------------------------
						// dependancy 가져오기
						//-----------------------------------
						
						out( 'TODO : 로딩바 보이기' );

						// 맨 처음 로드 요청인 경우 common dependancy도 함께 로드
						if(self._isCommonDependancyLoaded === false){
							var common = self._getCommonDependancies();
							dependencies = common.concat( dependencies );
							self._isCommonDependancyLoaded = true;
						}

						//if (templateUrl) dependencies.unshift('text!' + templateUrl);
						
						require( dependencies, function() {
							out( '* DEPENDANCY LOAD : ', dependencies );

							$rootScope.$apply( function() {
								deferred.resolve();
							} );

							loaded = true;
							out( 'TODO : 로딩바 닫기' );
						} );

						return deferred.promise;
					}
				] // end resolve

			}

			return definition;
		},

		/////////////////////////////////////
		//  공통 dependancy 정의
		/////////////////////////////////////
		
		_getCommonDependancies: function( ) {
			var dependencies = [

				// DIRECTIVE
				_PATH.DIRECTIVE + 'layout',
				_PATH.DIRECTIVE + 'version',

				// SERVICE
				_PATH.SERVICE + 'VersionService',
				_PATH.SERVICE + 'ProgressService',
				_PATH.SERVICE + 'DataService'
			];

			return dependencies;
		},

		/////////////////////////////////////
		//  각 Route별 dependancy 정의
		/////////////////////////////////////
		
		// template에는 ng-controller='Controller 이름' 속성이 명시되어 있어야 한다.
		
		_getRoutes: function() {

			var paths = {

				//-----------------------------------
				// DEFAULT
				//-----------------------------------
				
				'/': {
					templateUrl: _PATH.TEMPLATE + 'home.html',
					dependencies: [
						_PATH.CONTROLLER + 'HomeController'
					]
				}

				//-----------------------------------
				// ADMIN
				//-----------------------------------

				,'/admin/': {
					templateUrl: _PATH.TEMPLATE + 'admin.html',
					dependencies: [
						_PATH.CONTROLLER + 'AdminController'
					]
				}

				//-----------------------------------
				// LOGIN 경로 설정
				//-----------------------------------
				
				,'/login/': {
					templateUrl: _PATH.TEMPLATE + 'login.html',
					dependencies: [
						_PATH.CONTROLLER + 'LoginController'
					]
				}

				//-----------------------------------
				// Application
				//-----------------------------------


				,'/tool/': {
					templateUrl: _PATH.TEMPLATE + 'tool.html',
					dependencies: [

						// CONTROLLER
						_PATH.CONTROLLER + 'ToolController',

						// DIRECTIVE
						_PATH.DIRECTIVE + 'menu',
						_PATH.DIRECTIVE + 'progressbar',
						_PATH.DIRECTIVE + 'tree',
						_PATH.DIRECTIVE + 'screen',
						_PATH.DIRECTIVE + 'timeline',
						_PATH.DIRECTIVE + 'property',
						_PATH.DIRECTIVE + 'status',

		        				// FACTORY
		        				_PATH.DATA + 'Data',
		        				_PATH.DATA + 'Tool',
		        				_PATH.DATA + 'Project',
						
						//SERVICE
						_PATH.SERVICE + 'ExecuteService',
						
						// COMMAND
						_PATH.COMMAND + 'Command',
						_PATH.COMMAND + 'NewCommand',
						_PATH.COMMAND + 'OpenCommand',
						_PATH.COMMAND + 'SaveCommand',
						_PATH.COMMAND + 'SaveAsCommand',
						_PATH.COMMAND + 'CloseCommand',
						_PATH.COMMAND + 'ExitCommand'
					]
				}
				
				/*
				,'/tool/:command': {
					templateUrl: _PATH.TEMPLATE + 'tool.html',
					dependencies: [
						_PATH.CONTROLLER + 'ToolController',

						_PATH.DIRECTIVE + 'menu',
						_PATH.DIRECTIVE + 'progressbar',
						_PATH.DIRECTIVE + 'explorer',
						_PATH.DIRECTIVE + 'screen',
						_PATH.DIRECTIVE + 'timeline',
						_PATH.DIRECTIVE + 'property',
						_PATH.DIRECTIVE + 'status'
					]
				}
				*/
				// Path END
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

	return Router;

	////////////////////////////////////////
	// END
	////////////////////////////////////////
} );