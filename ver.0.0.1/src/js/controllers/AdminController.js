'use strict';

define(['Application'], function(application) {

    application.controller( 'AdminController', _controller );

    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------

        //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

        //-----------------------
        // scope 데이터 설정
        //-----------------------

        $scope._name = 'AdminController';
    }

    // 컨트롤러 리턴
    return _controller;

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});