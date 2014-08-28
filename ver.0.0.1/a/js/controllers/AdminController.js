'use strict';

define([], function () {
    
    //컨트롤러 선언
    function _controller($scope) {

        //-----------------------
        // CSS 설정
        //-----------------------
        
        $scope.$emit('updateCSS', []);
        
        //-----------------------
        // scope 데이터 설정
        //-----------------------
        
        //컨트롤러3 메시지
        $scope.message = "AdminController";
        $scope.name = "Admin Controller";
        
        //내부 컨트롤러 4 선언
        $scope.AdminSubController = function($scope) {
            //컨트롤러4 메시지
            $scope.message = "AdminSubController";
        };
        
    }

    //생성한 컨트롤러 리턴
    return _controller;
});
