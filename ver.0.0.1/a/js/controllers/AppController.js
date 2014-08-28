'use strict';

define([], function () {

    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------
        
        $scope.$emit('updateCSS', [_PATH.CSS + 'app.css']);
        
        //-----------------------
        // scope 데이터 설정
        //-----------------------
        
        $scope.message = 'Application Controller';
        $scope.name = "Application Controller";
    }

    // 생성한 컨트롤러 리턴
    return _controller;
});
