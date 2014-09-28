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
        application.directive( 'screen', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',
                templateUrl: _PATH.TEMPLATE + 'screen.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: false,

                terminal: false,
                
                controller: function( $scope, $element, $attrs, $transclude, $rootScope, $route, $routeParams, $location ) {
                    out('TODO : 로드된 데이터에 따라 screen에 각 document를 생성한다. (ui-canvas, Impress 적용)');

                    // $scope.project = Project.current.getProject());

                    $scope.$watch('project', function(newValue, oldValue) {
                        if (newValue === oldValue) { return; }
                        out('#project changed : ', $scope.project);
                    }, true);
                    
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


// 드래그 예제
// https://code.angularjs.org/1.2.23/docs/guide/compiler