/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [], function() {

        // 선언
        function _controller( $scope ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

            //-----------------------
            // scope 데이터 설정
            //-----------------------

        }

        // 리턴
        _controller._regist = function(application){
            // 등록
            application.controller( 'AdminController', _controller );
        };
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);

// [참고]
// nodeJS + angularJS  (로그인, 회원 가입, 삭제, 리스트)
// http://deepplin.blog.me/220090099948