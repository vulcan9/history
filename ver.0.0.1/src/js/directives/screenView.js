/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : directive 정의, 등록

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'ExtendSpace'
    ],
    function( application, ExtendSpace ) {

        // 등록
        application.directive( 'screenView', _directive );

        // 선언
        function _directive() {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',
                // templateUrl: _PATH.TEMPLATE + 'view/screenView_sample.html',
                templateUrl: _PATH.TEMPLATE + 'view/screenView.html',
                
                replace: true,
                priority: 0,
                transclude: true,
                scope: {},

                terminal: false,
                
                controller: Controller

            };


            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller ( $scope, $element, $attrs, Project , CommandService) {

                out('TODO : 로드된 데이터에 따라 screen에 각 document를 생성한다. (ui-canvas, Impress 적용)');

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
                        out('#Project.added-DOCUMENT (screen) : ', data);
                        __onAddDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.removed-DOCUMENT (screen) : ', data);
                        __onRemoveDocument(data.item);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.modified-DOCUMENT (screen) : ', data);
                        __onModifyDocument(data.item);
                    }
                });

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.selected-DOCUMENT (screen) : ', data);
                        _onSelectDocument(data.item, data.oldValue);
                    }
                });

                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------

                function __onAddDocument(item){

                }

                function __onRemoveDocument(item){
                    
                }

                function __onModifyDocument(item){
                    
                }

                function _onSelectDocument(newItem, oldItem){
                    out(' - oldValue : ', oldItem);
                    out(' - newValue : ', newItem);
                    //uid로 DOM 찾아내기
                    //out('current select : ', Project.current.getSelectDocument());
                }
/*
depth 0 - index
            -
    depth 1 - index
*/

                ////////////////////////////////////////
                // TREE, DOCUMENT 데이터
                ////////////////////////////////////////

                /*
                updatedocumentList();

                //------------------
                // 데이터 변경 감지 순서 - OpenCommand
                //------------------
                
                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Project.changed-TREE (screen) : ', arguments);
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
                    updatedocumentList();
                }, true);

                //------------------
                // 데이터 변경 감지 순서 - OpenCommand
                //------------------

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.changed-DOCUMENT (screen) : ', arguments);
                        self.updateDocument();
                    }
                });

                // 2. 변경 내용을 scope에 적용한다.
                this.updateDocument = function(){
                    $scope.document = Project.current.project('DOCUMENT');
                }
                
                // 3. scope이 변경되었음을 감지한다.
                $scope.$watch('document', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.document changed (screen) : ', $scope.document);
                    updatedocumentList();
                }, true);
                */
                

                ////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////

                // Document 선택
                $scope.selectDocument = function(item, index){
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









                    ////////////////////////////////////////////////////////////////////////////////
                    //
                    // 화면 업데이트
                    // 
                    ////////////////////////////////////////////////////////////////////////////////

                    //------------------
                    // 데이터 변경된 경우 화면 업데이트
                    //------------------

                    function updatedocumentList(){
                        
                        /*
                        <li ng-repeat="item in tree.items">
                            {{$index + 1}} : {{document[item.uid].document}}
                        </li>
                        */
                        
                        /*
                        var api = window.Space("u-screen");
                        api.config({
                            useHashHistory:false
                        });
                        
                        if(!$scope.tree || !$scope.document){
                            api.init([]);
                            return;
                        }
                        
                        // 편집 : contentEditable
                        var documents = [];
                        var items = $scope.tree.items;
                        for(var uid in items)
                        {
                            var docs = $scope.document.items[uid];
                            if(docs == null) continue;

                            var div = docs.document.content;
                            out('* ', uid, ' : ', div);
                            documents.push(div);
                        }
                        
                        var documents1 = [
                            '<div id="overview" data-scale="10" data-x="0" data-y="0"></div>',

                            '<div id="center1" data-scale="0.5" data-x="0" data-y="0" style="background:red;"></div>',

                            '<div id="bored" data-scale="2" data-x="-2000" data-y="0"><h1>프로젝트 주제 : 사이트 기획</h1><br>디자인 자료 준비해야 함<br><br><a href="#bored1">메인 컨셉 디자인 진행</a><br><a href="#bored1-2">서브 컨셉 디자인 진행</a></div>',
                                '<div id="bored-1" data-scale="1" data-x="-2500" data-y="200">어떤 컨셉이 좋을까요? <br><strong>유머스러운~</strong> 아니지~! <br><strong>copy the limits</strong> <br>디자인 어디서 배웠어? <br><a href="#bored">모두 보기</a></div>',
                                    '<div id="bored-1-1" data-scale="0.5" data-x="-2500" data-y="200">ㅎㅎㅎ어떤 컨셉이 좋을까요? <br><strong>유머스러운~</strong> 아니지~! <br><strong>copy the limits</strong> <br>디자인 어디서 배웠어? <br><a href="#bored">모두 보기</a></div>',
                                '<div id="bored-2" data-scale="1" data-x="-1500" data-y="200"><q>Would you like to <strong>impress your audience</strong> with <strong>stunning visualization</strong> of your talk?</q></div>',

                            '<div id="bored1" data-scale="2" data-x="1000" data-y="0" data-rotate="-45"><h1>#디자인 어디까지 해봤니~</h1><br><a href="#bored1-1">컨셉 디자인 진행1</a><br><a href="#bored1-2">컨셉 디자인 진행2</a></div>',
                                '<div id="bored1-1" data-scale="1" data-x="1500" data-y="500" data-rotate="-45">어떤 컨셉이 좋을까요? <br><strong>유머스러운~</strong> 아니지~! <br><strong>copy the limits</strong> <br>디자인 어디서 배웠어? <br><a href="#bored">기획 보기</a></div>',
                                '<div id="bored1-2" data-scale="1" data-x="2500" data-y="0" data-rotate="-45"><q>Would you like to <strong>impress your audience</strong> with <strong>stunning visualization</strong> of your talk?</q><br><iframe width="560" height="315" src="http://www.youtube.com/embed/ylLzyHk54Z0" frameborder="0" allowfullscreen="true"></iframe><br><a href="#bored">기획 보기</a></div>'
                        ];
                        
                        // 데이터 적용
                        api.init(documents);
                        */
                    }













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