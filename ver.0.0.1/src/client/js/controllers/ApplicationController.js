/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'U'
    ],
    function(U) {

        // 선언
        function _controller( $scope, $element, $attrs, $log, $location, $rootScope, $window, AuthService ) {

            out( '# ApplicationController 로드됨' );

            //-----------------------
            //스타일시트 업데이트
            //-----------------------

            $scope.$on( 'updateCSS', function( event, args ) {
                $scope.stylesheets = args;
            } );

            //-----------------------
            // CSS 설정
            //-----------------------

            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css',
                _PATH.CSS + 'application.css',
                
                '//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css',
                _PATH.CSS + 'login.css'
            ] );

            //$scope.$emit('updateCSS', [_PATH.CSS + 'login.css']);
            // <link href="//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css" rel="stylesheet">

            //-----------------------
            // log 함수 수정
            //-----------------------

            if ( window.out !== undefined ) {
                window.out.$log = $log;
            }

            //-----------------------
            // Auth 네비게이션
            //-----------------------

            $rootScope.go_back = function(){
                $window.history.back();
            }

            $rootScope.go_home = function() {
                $location.path('/');
            };

            $rootScope.go_dashboard = function() {
                $location.path('/dashboard');
            };

            $rootScope.go_login = function() {
                $location.path('/login');
            };

            $rootScope.go_signup = function() {
                $location.path('/signup');
            };

            $rootScope.go_profile = function() {
                $location.path('/profile');
            };

            $rootScope.go_tool = function(uid) {
                // uid = uid || 'newproject:project-';
                uid = uid || 'new:project-' + U.createUID();
                $location.path('/tool/' + uid);
            };

            $rootScope.auth_isAuthenticated = function() {
                return AuthService.isAuthenticated();
            };

            $rootScope.auth_logout = function() {
                AuthService.logout();
            };

            $rootScope.auth_signout = function() {
                AuthService.signout();
            };

            $rootScope.auth_authenticate = function(provider) {
                AuthService.authenticate(provider);
            };

            // END Controller
        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller('ApplicationController', _controller);
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);