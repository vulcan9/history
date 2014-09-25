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
        application.directive( 'progressbar', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',

                templateUrl: _PATH.TEMPLATE + 'progressbar.html',
                
                replace: true,
                transclude: true,
                // scope: false,

                controller : function( $scope, ProgressService) {
                    
                    //$scope.progress = ProgressService;
                    
                    //*
                    
                    // watch를 이용한 업데이트 방법
                    $scope.$watch('TOOL.progress', function(newValue, oldValue) {
                        
                        // if (newValue === oldValue) { return; }
                        onUpdate();

                    }, true);
                    
                    /*/
                    
                    // 이벤트를 이용한 업데이트 방법 - 이벤트 등록전에는 업데이트 못함
                    $scope.$on('#progressService.progressChange', function(event, progress){
                        out('progress - ', progress);
                        onUpdate();
                    }); 

                    //*/
                   
                    function onUpdate(){
                        /*
                        $scope.progress = {
                            value : ProgressService.value,
                            isPercentage : ProgressService.isPercentage
                        };
                        */
                       $scope.TOOL.progress = ProgressService;
                    }

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
