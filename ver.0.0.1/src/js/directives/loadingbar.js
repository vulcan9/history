/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

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

                terminal: false,

                controller: function( $scope, Version ) {
                    $scope.value = '50%';
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
