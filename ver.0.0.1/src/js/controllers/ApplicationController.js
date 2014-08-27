'use strict';

define([], function() {

    //컨트롤러 선언
    function _controller($scope, $element, $attrs, $transclude) {

        //-----------------------
        //스타일시트 업데이트
        //-----------------------

        $scope.$on('updateCSS', function(event, args) {
            $scope.stylesheets = args;
        });

        //-----------------------
        // CSS 설정
        //-----------------------

        $scope.$emit('updateCSS', [_PATH.CSS + 'application.css']);

        //-----------------------
        // scope 데이터 설정
        //-----------------------

        $scope._name = 'ApplicationController';
    }

    // 컨트롤러 리턴
    return _controller;

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});