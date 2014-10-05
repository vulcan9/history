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
        application.directive( 'screenView', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',
                templateUrl: _PATH.TEMPLATE + 'view/screenView.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: {},

                terminal: false,
                
                controller: function( $scope, $element, $attrs, $transclude, $rootScope, $route, $routeParams, $location ) {
                    out('TODO : 로드된 데이터에 따라 screen에 각 document를 생성한다. (ui-canvas, Impress 적용)');

                    //------------------
                    // 데이터 변경 감지 순서 - OpenCommand
                    //------------------

                    // 1. 이벤트를 받는다.
                    var self = this;
                    $scope.$on('#Data.changed-TREE', function(e, data){
                        if(data.name == 'TREE'){
                            out('#Data.changed-TREE (screen) : ', arguments);
                            self.updateTree();
                        }
                    });

                    // 2. 변경 내용을 scope에 적용한다.
                    this.updateTree = function(){
                        $scope.tree = Project.current.project('TREE');
                    }
                    
                    // 3. scope이 변경되었음을 감지한다.
                    $scope.$watch('tree', function(newValue, oldValue) {
                        if (newValue === oldValue) { return; }
                        out('#tree changed (screen) : ', $scope.tree);

                    }, true);
                    
                    //------------------
                    // 데이터 변경된 겨우 화면 업데이트
                    //------------------

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