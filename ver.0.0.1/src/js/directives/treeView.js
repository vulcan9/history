/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.directive( 'treeView', _directive );

        /*
        application.filter('orderBy', _filter);
        function _filter() {
            return function(items, field, reverse) {
                
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });

                filtered.sort(function (a, b) {
                    //return (a[field] > b[field] ? 1 : -1);
                    if (a[field] > b[field]){
                        return 1;
                    }else if (a[field] < b[field]){
                        return -1;
                    }else{
                        return (a['index'] > b['index'] ? 1 : -1);
                    }
                });

                if(reverse) filtered.reverse();
                return filtered;


                // 1. depth로 정렬
                // 2. 
                // Tree component
                // http://jimliu.github.io/angular-ui-tree/
            };
        }
        */

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
            
            function Controller ( $scope, $element, $attrs, Project , CommandService) {

                $element.trigger('#view.layoutUpdate');

                ////////////////////////////////////////
                // TREE 데이터
                ////////////////////////////////////////

                //*
                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Project.changed-TREE (tree) : ', arguments);

                        // 2. 변경 내용을 scope에 적용한다.
                        var tree = Project.current.project('TREE');
                        $scope.tree = (tree)? tree.items : [];
                    }
                });
                
                // 3. scope이 변경되었음을 감지한다.
                $scope.$watch('tree', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.tree changed (tree) : ', $scope.tree);
                    $element.trigger('#view.layoutUpdate');
                }, true);
                //*/

                ////////////////////////////////////////
                // DOCUMENT 데이터
                ////////////////////////////////////////
                
                /*
                #Project.added-DOCUMENT
                #Project.removed-DOCUMENT
                #Project.modified-DOCUMENT
                #Project.selected-DOCUMENT
                */

                // var data = {data:project};
                $scope.$on('#Project.initialized', function(e, data){
                    // $scope.tree = Project.current.project('TREE');
                    // $scope.document = Project.current.project('DOCUMENT');
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.added-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.added-DOCUMENT (tree) : ', data);
                        __onAddDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.removed-DOCUMENT (tree) : ', data);
                        __onRemoveDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.modified-DOCUMENT (tree) : ', data);
                        __onModifyDocument(data.item);
                    }
                });

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.selected-DOCUMENT (tree) : ', data);
                        __onSelectDocument(data.newValue, data.oldValue);
                    }
                });

                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------

                /*
                <div class="paper" ng-repeat="item in tree.items" ng-click="selectDocument(item, $index)">
                    {{$index}}
                </div>
                */
                function __onAddDocument (item){
                    //
                }

                function __onRemoveDocument(item){
                    out('TODO : select 상태의 item이 삭제되었는지 검사');
                }

                function __onModifyDocument(item){
                    
                }

                function __onSelectDocument(newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    $scope.selectUID = newValue;
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                //-----------------------------------
                // Tree component
                // http://jimliu.github.io/angular-ui-tree/
                //-----------------------------------

                // dom에서 this == scope
                $scope.toggle = function(scope) {
                    scope.toggle();
                };

                /*
                $scope.moveLastToTheBeginning = function () {
                    var a = $scope.data.pop();
                    $scope.data.splice(0,0, a);
                };
                */
                
                $scope.collapseAll = function() {
                    $scope.$broadcast('collapseAll');
                };

                $scope.expandAll = function() {
                    $scope.$broadcast('expandAll');
                };

                // Document 선택
                $scope.selectDocument = function(item){
                    __selectDocument(item);
                };
                
                $scope.addDocument = function(item) {
                    // scope 이용할 경우
                    // var nodeData = scope.$modelValue;
                    // nodeData.items.push({새로운 Documnt - tree item});

                    var uid = item.uid;
                    __addDocument('sub', uid);
                };

                $scope.removeDocument = function(item) {
                    alert('TODO : removeCommand로 처리');
                    alert('삭제 하시겠습니니까?');
                    // scope.remove();
                    // $scope.$modelValue.splice(index, 1)[0];

                    // var uid = item.uid;
                    // __removeDocument(uid);
                };

                ////////////////////////////////////////
                // DOM 인터렉션 실행
                ////////////////////////////////////////

                // Document 선택
                function __selectDocument (item){
                    var param = {
                        uid : item.uid
                    };
                    var command = CommandService.SELECT_DOCUMENT;
                    out('\n# [ ', command, ' ] 명령 실행');

                    CommandService.execute(command, param, function callback(isSuccess, result){
                        out('# [ ', command, ' ] 명령 실행 종료 : ', isSuccess, ' - ', result);
                    });
                }

                // Document 추가 
                // option : 'next', 'sub', 'prev'
                function __addDocument (option, uid){

                    if(Project.current == null) return;

                    // 현재 선택 상태의 Document uid 의  nextSibling에 추가한다.
                    // selectUID에 해당되는 tree item 노드 찾기
                    var selectUID = uid || Project.current.getSelectDocument();
                    var position = Project.current.getTreePosition(selectUID, option);
                    
                    // command 호출
                    var param = {
                        //document : null,
                        treePosition : position
                    };

                    var command = CommandService.ADD_DOCUMENT;
                    out('\n# [ ', command, ' ] 명령 실행');

                    CommandService.execute(command, param, function callback(isSuccess, result){
                        out('# [ ', command, ' ] 명령 실행 종료 : ', isSuccess, ' - ', result);
                    });
                }

                function __removeDocument (uid){
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        return _directive;

        ////////////////////////////////////////
        // END
        ////////////////////////////////////////
    }
);
