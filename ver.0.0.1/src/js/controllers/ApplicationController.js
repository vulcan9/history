'use strict';

define([], function() {

    //컨트롤러 선언
    function _controller($scope, $element, $attrs, $transclude, $log) {

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

        // log 함수 설정
        if(window.out !== undefined){
            window.out.$log = $log;
        }
    }

    // 컨트롤러 리턴
    return _controller;

    ////////////////////////////////////////
    // END
    ////////////////////////////////////////
});


