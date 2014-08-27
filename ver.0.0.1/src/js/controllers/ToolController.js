'use strict';

define([
        _PATH.DIRECTIVE + 'version'
    ],
    function(version) {

        //컨트롤러 선언
        function _controller($scope, $route, $routeParams, $location) {

            //-----------------------
            // CSS 설정
            //-----------------------

            //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

            //-----------------------
            // scope 데이터 설정
            //-----------------------

            $scope._name = 'ToolController';

            $scope.$route = $route;
            $scope.$location = $location;
            $scope.$routeParams = $routeParams;

            out('ToolController loaded');
        }
        
        // 컨트롤러 리턴
        return _controller;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    });

