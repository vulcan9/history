'use strict';

define(
    [
        'Application',
        _PATH.DIRECTIVE + 'version'
    ],
    function( application, version ) {

        application.controller( 'ToolController', _controller );

        //컨트롤러 선언
        function _controller( $scope, $route, $routeParams, $location, $rootScope ) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'ToolController';

            $rootScope.$route = $route;
            $rootScope.$location = $location;
            $rootScope.$routeParams = $routeParams;

            out( '$route : ', $route );
            out( '$location : ', $location );
            out( '$routeParams : ', $routeParams );

            out( 'ToolController loaded' );
        }

        // 컨트롤러 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);