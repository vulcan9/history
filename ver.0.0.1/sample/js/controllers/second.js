'use strict';

define([], function () {

    //컨트롤러 선언
    function _controller($scope, serviceName) {
        
        //-----------------------
        // CSS 설정
        //-----------------------
        //
        $scope.$emit('updateCSS', [_PATH.CSS + 'css2.css']);

        //-----------------------
        //scope 데이터 설정
        //-----------------------
        
        //컨트롤러2 메시지
        $scope.message = "I'm the 2nd controller! " + serviceName;
        
        //변수가 살아있는지 테스트하기 위함.
        $scope.clickNum = $scope.clickNum || 0;
        
        //-----------------------
        //scope 메서드 설정
        //-----------------------
        
        //버튼 클릭시 변수 증가
        $scope.onClick = function()
        {
            $scope.clickNum++;
        }
    }

    // 생성한 컨트롤러 리턴
    return _controller;
});
