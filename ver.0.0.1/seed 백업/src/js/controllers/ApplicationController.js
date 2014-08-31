/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : controller 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        //
    ],
    function() {

        // 등록 안됨 (application config 전임)
        //application.controller( 'ApplicationController', _controller );

        // 선언
        function _controller( $scope, $element, $attrs, $transclude, $log, $route, $location, $routeParams, $rootScope ) {

            //-----------------------
            //스타일시트 업데이트
            //-----------------------

            $scope.$on( 'updateCSS', function( event, args ) {
                $scope.stylesheets = args;
            } );

            //-----------------------
            // CSS 설정
            //-----------------------

            $scope.$emit( 'updateCSS', [ _PATH.CSS + 'application.css' ] );

            //-----------------------
            // log 함수 수정
            //-----------------------

            if ( window.out !== undefined ) {
                window.out.$log = $log;
            }

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'ApplicationController';


out('TODO : Model 정의할것!');


            /*
            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;
            */
           
            out( 'ApplicationController loaded' );
        }

        // 컨트롤러 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);