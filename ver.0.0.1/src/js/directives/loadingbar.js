/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : 로딩바, Progress Bar 를 표시

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application'
    ],
    function( application ) {

        // 등록
        application.directive( 'loadingbar', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',

                templateUrl: _PATH.TEMPLATE + 'loadingbar.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: false,

                controller : function( $scope, Loading) {

                    //*
                    // watch를 이용한 업데이트 방법
                    $scope.$watch('progress', function(newValue, oldValue) {
                        //if (newValue === oldValue) { return; }
                        onUpdate();
                    }, true);
                    /*/
                    // 이벤트를 이용한 업데이트 방법
                    $scope.$on('loadStateUpdate', function(event, progress){
                        out('progress - ', progress);
                        onUpdate();
                    }); 
                    //*/
                   
                    function onUpdate(){
                        var isPercentage = Loading.isPercentage();
                        var value =  Loading.value();

                        $scope.value = value;
                        $scope.isPercentage = isPercentage;
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
