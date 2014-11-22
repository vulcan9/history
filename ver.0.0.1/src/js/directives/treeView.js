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
                        addDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.removed-DOCUMENT (tree) : ', data);
                        removeDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.modified-DOCUMENT (tree) : ', data);
                        modifyDocument(data.item);
                    }
                });

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.selected-DOCUMENT (tree) : ', data);
                        selectDocument(data.newValue, data.oldValue);
                    }
                });

                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------

                function addDocument (item){
                    /*
                    <div class="paper" ng-repeat="item in tree.items" ng-click="selectDocument(item, $index)">
                        {{$index}}
                    </div>
                    */

                    // 필터링
                    // 1. TREE 데이터에 따라 depth - index 순으로 정렬한다.
                    // 2. 정렬된 순서대로 Dom에 추가한다.
                    
                    //var tree = Project.current.project('TREE');
                    //var treeItem = Project.current.getTree(item.uid);
                    //out('addDocument : ', item.uid, treeItem);

                }

                function removeDocument(item){
                    out('TODO : select 상태의 item이 삭제되었는지 검사');
                }

                function modifyDocument(item){
                    
                }

                function selectDocument(newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    $scope.selectUID = newValue;
                }

                ////////////////////////////////////////
                // TREE 데이터
                ////////////////////////////////////////

                //*
                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Project.changed-TREE (tree) : ', arguments);
                        self.updateTree();
                    }
                });

                // 2. 변경 내용을 scope에 적용한다.
                this.updateTree = function(){
                    var tree = Project.current.project('TREE');
                    if(!tree){
                        $scope.tree = [];
                        return;
                    }

                    $scope.tree = tree.items;
                }
                
                // 3. scope이 변경되었음을 감지한다.
                $scope.$watch('tree', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.tree changed (tree) : ', $scope.tree);
                    $element.trigger('#view.layoutUpdate');
                }, true);
                //*/
                

                //-----------------------------------
                // Tree component
                // http://jimliu.github.io/angular-ui-tree/
                //-----------------------------------

                $scope.remove = function(scope) {
                    scope.remove();
                };

                $scope.toggle = function(scope) {
                    scope.toggle();
                };

                /*
                $scope.moveLastToTheBeginning = function () {
                    var a = $scope.data.pop();
                    $scope.data.splice(0,0, a);
                };
                */

                $scope.addItem = function(scope) {
                    var nodeData = scope.$modelValue;
                    var uid = U.createUID();
                    //var treeItem = Project.current.getDefinitionTree(uid);

                    // nodeData.items.push({
                    //     "uid" : uid,
                    //     "name" : "bored-2",
                    //     "parentUID": "document-b16fea9c-d10a-413b-ba20-08344f937339",
                    //     "items": []
                    // });
                    alert('구현안됨 - addDocumentCommand');



// Project의 selectUID를 Tool로 옮긴다.
// Project.current.project('DOCUMENT').selectUID
// Tool.current.tool('CURRENT').document.selectUID
// Select 관리를 해야한다.




                    // 3. treeItem.items.push({새로운 Documnt - tree item});





























                };

                $scope.collapseAll = function() {
                    $scope.$broadcast('collapseAll');
                };

                $scope.expandAll = function() {
                    $scope.$broadcast('expandAll');
                };

                ////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////

                // Document 선택
                $scope.selectDocument = function(item){

                    //$filter('orderBy')(array, expression, reverse)
                    //var treeItem = Project.current.getTree(item.uid);
                    
                    var param = {
                        uid : item.uid
                    };
                    var command = CommandService.SELECT_DOCUMENT;
                    out('\n# [ ', command, ' ] 명령 실행');

                    CommandService.execute(command, param, function callback(isSuccess, result){
                        out('# [ ', command, ' ] 명령 실행 종료 : ', isSuccess, ' - ', result);
                    });
                };
                
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
