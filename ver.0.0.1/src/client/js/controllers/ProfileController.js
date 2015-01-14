/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _controller( $scope, AuthService ) {

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

            $scope.auth_getProfile = function(){
                AuthService.getProfile(function(data) {
                    $scope.user = data;
                });
            };

            $scope.auth_updateProfile = function(){
                var data = {
                    displayName: $scope.user.displayName,
                    email: $scope.user.email
                }
                AuthService.updateProfile(data);
            };

            /*
            $scope.link = function(provider, userData){
                AuthService.link(provider, userData, function(data) {
                    $scope.user = data;
                });
            };

            $scope.unlink = function(provider){
                AuthService.unlink(provider, function(data) {
                    $scope.user = data;
                });
            };
            */

            $scope.auth_getProfile();
        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller('ProfileController', _controller);
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);