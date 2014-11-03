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
        application.directive( 'treeView', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                restrict: 'EA',
                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'view/treeView.html',
                replace: true,
                scope: {},
                
                controller: Controller

            };

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller ( $scope, $element, $attrs, Project ) {
                
                //------------------
                // 데이터 변경 감지 순서 - OpenCommand
                //------------------

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Data.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Data.changed-TREE (tree) : ', arguments);
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
                    out('# $scope.tree changed (tree) : ', $scope.tree);
                    $element.trigger('#view.layoutUpdate'); 

                }, true);

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }



        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
