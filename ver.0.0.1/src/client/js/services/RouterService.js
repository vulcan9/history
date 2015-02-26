/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : Route  정의
    *     

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

	// 선언
	function _service( AuthService, $location, $rootScope, $route, $injector, NoticeService ) {

		function RouterService( ) {
			//
		}

		var $routeProvider;

		RouterService.prototype = {

			config: function(application, callback) {

				this.application = application;
				$routeProvider = application.$routeProvider;

				// 공통으로 사용되는 dependancy가 로드 되었는지 체크
				this._isCommonDependancyLoaded = false;

				//-----------------------------------
				//  html5Mode
				//  https://code.angularjs.org/1.2.23/docs/guide/$location
				//-----------------------------------

				// configure html5 to get links working on jsfiddle
				// 아래 코드를 활성화(true) 시키면 해쉬(#)가 제거된 형태의 url로 표시된다.
				// 하지만, 주소표시줄에 나타난 주소로 직접 접근할 수는 없다.
				// false로 설정하는 경우엔 [#hash] 또는 [#/hash] 형태로 링크 건다.

				application.$locationProvider.html5Mode( false );
				// application.$locationProvider.hashPrefix('!');

				//-----------------------------------
				//  Route
				//-----------------------------------

				var routes = this._getRoutes();
				this._when( routes, callback );
			},

			////////////////////////////////////////
			// Route 체크 (로그인 세션)
			////////////////////////////////////////
			
			run: function() {

				//*
				// change the path
				//$location.path('/login');

				var self = this;
				$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute){
					out('# routeChangeStart : ', $location.path());

					if(prevRoute && prevRoute.$$route){
						var path = prevRoute.$$route.originalPath;
						if(path === '/tool/:projectUID'){
							var nextPath = $location.path();
							checkSave(event, nextPath);
							checkNoticePopup(event);
							return;
						}
					}

					checkNoticePopup(event);

					// redirect된 상황인지를 필터링
					// var path = $location.path();
					if(currRoute.$$route)
					{
						var path = currRoute.$$route.originalPath;
						if(path === '/admin' || path === '/profile' || path === '/dashboard'){
							checkAuth(event);

						}else if(path === '/tool'){
							// projectUID가 없으면 허용하지 않음
							// var projectUID = Project.current.createProjectUID();
							// checkAuth(event);
							event.preventDefault();
							$location.path('/dashboard');

						}else if(path === '/tool/:projectUID'){
							checkAuth(event);
							var projectUID = currRoute.params['projectUID'];
							checkUID(projectUID, event);
						}else{
							if(currRoute.redirectTo){
								out('# routeChangeStart redirectTo : ', currRoute.redirectTo);
								$location.path(currRoute.redirectTo);
							}
						}
					}
				});

				$rootScope.$on("$routeChangeSuccess", function (event, currRoute, prevRoute) {
					out('# routeChangeSuccess : ', $location.path(), currRoute);
					// #/tool/currRoute.projectUID
				});
				
				function checkNoticePopup(event){
					// alert('popup 모두 닫기');
					NoticeService.clear();
				}

				function checkAuth(event){
					if(AuthService.isAuthenticated()){
						if(AuthService.session) return;

						if(event) event.preventDefault();
						AuthService.getProfile(function(){
							$route.reload();
						});
						return;
					}

					// 세션 체크(로그인 페이지로 이동
					if(event) event.preventDefault();
					$location.path('/login');
				}

				function checkUID(uid, event){
					// uid 유효성 검사
					var available = uid && (uid.indexOf('project-') == 0 || uid.indexOf('new:project-') == 0);
					if(!available){
						if(event) event.preventDefault();
						$location.path('/dashboard');
					}
					/*
					// uid 유효성 검사
					if(uid && uid.indexOf('new:project-')) == 0){
						if(event) event.preventDefault();
						var projectUID = 'project-' + U.createUID();
						$location.path('/tool/' + projectUID);
						return;
					}

					var available = uid && (uid.indexOf('project-') == 0);
					if(!available){
						if(event) event.preventDefault();
						$location.path('/dashboard');
					}
					*/
				}

				function checkSave(event, nextPath){
					out('# RouterService에서 저장 상태 확인');
					// if(Tool.current && Tool.current.dataChanged == false) return;
					if(!Tool.current) return;

					if(event) event.preventDefault();
					require( [_PATH.SERVICE + 'CommandService.js'], function(CommandService) {
						$injector.invoke([
							'CommandService', function(CommandService){
								CommandService.exe(CommandService.EXIT, {}, function(){
									// $route.reload();
									$location.path(nextPath);
								});
							}
						]);
					} );
				}
				//*/
			},

			/////////////////////////////////////
			//  Route 설정
			/////////////////////////////////////

			// $$routeProvider : https://docs.angularjs.org/api/ngRoute/provider/$routeProvider
			// when(path, routeObject);
			// params : $route.current
			// otherwise(params);

			_when: function( routes, callback ) {

				var self = this;
				if ( routes !== undefined ) {
					angular.forEach( routes.paths, function( route, path ) {

						var templateUrl = route.templateUrl;
						var definition = self._getRouteDefinition( templateUrl, path, route.dependencies, callback );
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

			_getRouteDefinition: function( templateUrl, path, dependencies, callback ) {

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
								checkSession(deferred, callback);
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

								// application에 등록
								var len = arguments.length;
								for(var i=0; i<len; ++i ){
									regist (arguments[i], dependencies[i]);
								}

								$rootScope.$apply( function() {
									checkSession(deferred, callback);
								} );
							} );

							return deferred.promise;
						}
					] // end resolve

				}

				function checkSession(defer, callback){
					if(AuthService.isAuthenticated()){
						if(!AuthService.session){
							AuthService.getProfile(function(){
								defer.resolve();
								callback();
								loaded = true;
								out( 'TODO : 로딩바 닫기' );
							});
							return;
						}
					}

					defer.resolve();
					callback();
					loaded = true;
					out( 'TODO : 로딩바 닫기' );
				}

				function regist (dependency, path){
					if(dependency._regist === undefined){
						throw '[Application 등록 에러] _regist 메서드를 정의하여 등록하세요. : ' + path;
					}
					// out('regist - ', dependency);

					dependency._regist (self.application);
				}

				return definition;
			},

			/////////////////////////////////////
			//  공통 dependancy 정의
			/////////////////////////////////////
			
			// ApplicationController 이전에 정의되어야하는 서비스는 PreInitialize에서 로드됨
			// NodeJS에서 실행할때 '.js' 확장자를 붙이지 않으면 파일 못찾음 (require만 사용할때는 확장자 생략 가능)

			_getCommonDependancies: function( ) {
				var dependencies = [

					// DIRECTIVE
					// _PATH.DIRECTIVE + 'version.js',

					// // SERVICE
					// _PATH.SERVICE + 'VersionService.js',
					// _PATH.SERVICE + 'ProgressService.js',
					// // _PATH.SERVICE + 'AuthService.js',
					
					// _PATH.SERVICE + 'HttpService.js',

					// _PATH.SERVICE + 'NoticeService.js',
					// _PATH.SERVICE + 'TalkService.js',

					_PATH.SERVICE + 'ProcessService.js'
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
							_PATH.CONTROLLER + 'HomeController.js'
						]
					}

					//-----------------------------------
					// LOGIN 경로 설정
					//-----------------------------------
					
					// 한 화면에서 팝업으로 처리한다.
					
					,'/signup': {
						templateUrl: _PATH.TEMPLATE + 'auth/signup.html',
						dependencies: [
							_PATH.CONTROLLER + 'SignupController.js'
						]
					}

					,'/profile': {
						templateUrl: _PATH.TEMPLATE + 'auth/profile.html',
						dependencies: [
							_PATH.CONTROLLER + 'ProfileController.js'
						]
					}

					// 로그인 상태에 따라 적절한 login 화면을 보여준다. 
					,'/login': {
						templateUrl: _PATH.TEMPLATE + 'auth/login.html',
						dependencies: [
							_PATH.CONTROLLER + 'LoginController.js'
						]
					}

					//-----------------------------------
					// ADMIN
					//-----------------------------------

					,'/dashboard': {
						templateUrl: _PATH.TEMPLATE + 'dashboard.html',
						dependencies: [
							_PATH.CONTROLLER + 'DashboardController.js'
						]
					}

					//-----------------------------------
					// Application
					//-----------------------------------

					,'/tool': {
						templateUrl: _PATH.TEMPLATE + 'tool.html',
						dependencies: [
							_PATH.CONTROLLER + 'ToolController.js'
						]
					}

					,'/tool/:projectUID': {
						templateUrl: _PATH.TEMPLATE + 'tool.html',
						dependencies: [

							// CONTROLLER
							_PATH.CONTROLLER + 'ToolController.js',

							// DIRECTIVE
							_PATH.DIRECTIVE + 'menuView.js',
							_PATH.DIRECTIVE + 'iconView.js',
							_PATH.DIRECTIVE + 'progressView.js',
							_PATH.DIRECTIVE + 'treeView.js',
							_PATH.DIRECTIVE + 'screenView.js',
							_PATH.DIRECTIVE + 'timelineView.js',
							_PATH.DIRECTIVE + 'propertyView.js',
							_PATH.DIRECTIVE + 'statusView.js',

							_PATH.DIRECTIVE + 'screen/loading.js',
							_PATH.DIRECTIVE + 'screen/background.js',
							_PATH.DIRECTIVE + 'screen/content.js',
							// _PATH.DIRECTIVE + 'screen/contentIframe',
							_PATH.DIRECTIVE + 'screen/element.js',
							
							_PATH.DIRECTIVE + 'ui/uiControl.js',
                            _PATH.DIRECTIVE + 'ui/keyBind.js',

			        				// FACTORY
			        				_PATH.DATA + 'Data.js',
			        				_PATH.DATA + 'Tool.js',
			        				_PATH.DATA + 'Project.js',
			        				
							_PATH.FACTORY + 'ScaleMode.js',
							_PATH.FACTORY + 'Drager.js',
							_PATH.FACTORY + 'Resizer.js',
							_PATH.FACTORY + 'Snap.js',
							
							//SERVICE
							_PATH.SERVICE + 'CommandService.js',
							
							// COMMAND
							_PATH.COMMAND + 'Command.js',
							_PATH.COMMAND + 'ConfigurationCommand.js',
							
							_PATH.COMMAND + 'NewCommand.js',
							_PATH.COMMAND + 'OpenCommand.js',
							_PATH.COMMAND + 'SaveCommand.js',
							_PATH.COMMAND + 'SaveAsCommand.js',
							_PATH.COMMAND + 'CloseCommand.js',
							_PATH.COMMAND + 'ExitCommand.js',

							_PATH.COMMAND + 'document/AddDocumentCommand.js',
							_PATH.COMMAND + 'document/RemoveDocumentCommand.js',
							_PATH.COMMAND + 'document/SelectDocumentCommand.js',
							_PATH.COMMAND + 'document/ModifyDocumentCommand.js',

							_PATH.COMMAND + 'element/AddElementCommand.js',
							_PATH.COMMAND + 'element/RemoveElementCommand.js',
							_PATH.COMMAND + 'element/ModifyElementCommand.js',
							_PATH.COMMAND + 'element/SelectElementCommand.js',

							_PATH.COMMAND + 'PlayCommand.js'
							// _PATH.COMMAND + 'EditCommand.js',

							
							
						]
					}
					/*
					,'/tool/:command': {
						templateUrl: _PATH.TEMPLATE + 'tool.html',
						dependencies: [
						]
					}
					*/

					//-----------------------------------
					// 404_NOT_FOUND
					//-----------------------------------

					,'/404_NOT_FOUND': {
						templateUrl: _PATH.TEMPLATE + '404.html',
						dependencies: [
						]
					}
					
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

		////////////////////////////////////////
		// END Service
		////////////////////////////////////////

		// 서비스 객체 리턴
		var instance = new RouterService();
		return instance;
	}

	// 리턴
	_service._regist = function(application){
	    // 등록
	    application.service( 'RouterService', _service );
	};
	return _service;

	////////////////////////////////////////
	// END
	////////////////////////////////////////
} );