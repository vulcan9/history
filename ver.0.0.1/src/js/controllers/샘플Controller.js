'use strict';

define([], function() {

    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------

        //$scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

        //-----------------------
        // scope 데이터 설정
        //-----------------------

        //$scope._name = 'SampleController';
    }

    // 컨트롤러 리턴
    return _controller;

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});


/*
$('body').injector().invoke(function($compile, $rootScope) {
    $compile($('#ctrl'))($rootScope);
    $rootScope.$apply();
});
*/