'use strict';

define([], function () {

    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------
        
        $scope.$emit('updateCSS', [_PATH.CSS + 'css1.css']);
        
        //-----------------------
        // scope 데이터 설정
        //-----------------------
        
        $scope.message = "I'm the 1st controller!";
        $scope.greeting = "Hello world!";       

    }

    // 생성한 컨트롤러 리턴
    return _controller;
});
