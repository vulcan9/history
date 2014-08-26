'use strict';

define([], function() {

    // 컨트롤러 리턴
    return _controller;

    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------

        //$scope.$emit('updateCSS', [_PATH.CSS + 'login.css']);

        //-----------------------
        // scope 데이터 설정
        //-----------------------

        $scope._name = 'LoginController';
    }

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});