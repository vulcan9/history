'use strict';

define([], function () {

    //컨트롤러 선언
    function _controller($scope) {
        
        //스타일시트 업데이트
        $scope.$on('updateCSS', function(event, args) {
            
            //파라메터로 받아온 스타일 시트 반영
            $scope.stylesheets = args;

         });

    }

    // 생성한 컨트롤러 리턴
    return _controller;
});
