/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _controller( $scope, $location, AuthService ) {

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

            //$scope.$emit('updateCSS', [_PATH.CSS + 'login.css']);
            // <link href="//cdnjs.cloudflare.com/ajax/libs/ionicons/1.5.2/css/ionicons.min.css" rel="stylesheet">

            //-----------------------
            // scope 데이터 설정
            //-----------------------

        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller( 'DashboardController', _controller );
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);