'use strict';

define(['Application'], function(application) {

    application.controller( 'LoginController', _controller );

    //컨트롤러 선언
    function _controller($scope, $route, $routeParams, $location) {

        //-----------------------
        // CSS 설정
        //-----------------------

        //$scope.$emit('updateCSS', [_PATH.CSS + 'login.css']);

        //-----------------------
        // scope 데이터 설정
        //-----------------------

        $scope._name = 'LoginController';

        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;

        out('LoginController loaded');
    }

    // 컨트롤러 리턴
    return _controller;

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});