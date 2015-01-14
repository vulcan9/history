/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _controller( $scope, AuthService, $window ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            /*
            $scope.$emit( 'updateCSS', [ 
                _PATH.CSS + 'basic.css',
                _PATH.CSS + 'application.css',
                
                '//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css',
                _PATH.CSS + 'login.css'
            ] );
            */

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope.auth_forgotPassword = function() {
                alert('forgotPassword');
            };

            $scope.auth_loginExecute = function() {
                var user = { 
                    email: $scope.email, 
                    password: $scope.password 
                };
                AuthService.login(user);
            };

            ////////////////////////////////////////
            // END Controller
            ////////////////////////////////////////
        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller('LoginController', _controller);
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);