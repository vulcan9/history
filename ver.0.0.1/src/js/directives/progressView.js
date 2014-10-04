/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 로딩바, ProgressService Bar 를 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'progressView', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',

                templateUrl: _PATH.TEMPLATE + 'view/progressView.html',
                
                replace: true,
                transclude: true,
                scope: {},

                controller : function( $scope, ProgressService) {
                    
                    $scope.progress = ProgressService;

                    //*
                    
                    // watch를 이용한 업데이트 방법
                    $scope.$watch('progress', function(newValue, oldValue) {
                        // if (newValue === oldValue) { return; }
                    }, true);
                    
                    /*/
                    
                    // 이벤트를 이용한 업데이트 방법 - 이벤트 등록전에는 업데이트 못함
                    $scope.$on('#progressService.progressChange', function(event, progress){
                        out('progress - ', progress);
                        onUpdate();
                    }); 

                    //*/
                }
            };

        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
