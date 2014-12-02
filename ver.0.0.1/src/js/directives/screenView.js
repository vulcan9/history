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
            
            function Controller ( $scope, $element, $attrs, Project , CommandService, $document, ScaleMode, $sce, $timeout) {

                //-----------------------------------
                // Background Pattern
                // Svg Attribute (ng-attr-xxx 사용해야함)
                // bug patch : http://alexandros.resin.io/angular-d3-svg/
                //-----------------------------------

                $scope.$watch('size', function(newValue, oldValue) {
                    $scope.ratio = getRatio(newValue.scale);
                }, true);

                // A4 : 595x842, ppt : 1193x671

                // margin은 (.paper) class 설정치를 참고할것
                var marginH = 70;
                var marginV = 70;
                var sourceWidth = Project.paper.width;
                var sourceHeight = Project.paper.height;
                var compareWidth = Math.max(0, sourceWidth - marginH);
                var compareHeight = Math.max(0, sourceHeight - marginV);

                $scope.size = getSize(1);
                $scope.stroke = 1;
                
                function getRatio(scale){
                    var obj = {
                        value: scale
                    };
                    for(var i=0; i<11; ++i){
                        var unit = i * 10;
                        obj['r' + unit] = unit  * scale;
                    }
                    return obj;
                }

                //-----------------------------------
                // Scale 연산
                //-----------------------------------

                var scaleMode = new ScaleMode({
                    sourceWidth: sourceWidth,
                    sourceHeight: sourceHeight,
                    compareWidth: Math.max(0, $element.width() - marginH),
                    compareHeight: Math.max(0, $element.height() - marginV)
                });
                scaleMode.scale(ScaleMode.SCALE_WINDOW);

                function getSize(scale){
                    var sizeObj={
                        scale: scale,
                        sourceWidth: sourceWidth,
                        sourceHeight: sourceHeight,
                        compareWidth: compareWidth,
                        compareHeight: compareHeight,

                        width: Math.ceil(sourceWidth*scale),
                        height: Math.ceil(sourceHeight*scale),
                        marginH : marginH,
                        marginV : marginV
                    };
                    return sizeObj;
                }

                function setSize(){
                    scaleMode.set({
                        sourceWidth: sourceWidth,
                        sourceHeight: sourceHeight,
                        compareWidth: compareWidth,
                        compareHeight: compareHeight
                    });

                    var scale = scaleMode.scale();
                    $scope.size = getSize(scale);

                    // 위치 업데이트 호출 (alignModule)
                    $document.trigger('#window.resize'); 
                }

                //-----------------------------------
                // layout 바뀔때 size 재조정
                //-----------------------------------

                /*
                $document.on('#dock.layoutUpdated', __onLayoutUpdated);
                function __onLayoutUpdated(){
                    $document.trigger('#window.resize'); 
                }
                */

                // layout이 변경이 완료된 후 이벤트 받음
                $document.on('#dock.layoutUpdating', __onLayoutUpdating);
                $scope.$on("$destroy", function() {
                    $document.off('#dock.layoutUpdating', __onLayoutUpdating);
                });

                $scope.$evalAsync( function(){
                    $element.trigger('#view.layoutUpdate');
                } );

                // 화면 사이즈에 따라 scale을 조정한다.
                // transform: scale({{transform.scale}}) translate({{transform.x}}px,{{transform.y}}px) ;
                // transform-origin: 0 0;" 
                function __onLayoutUpdating(e, data){
                    compareWidth = Math.max(0, data.center.width - marginH);
                    compareHeight = Math.max(0, data.center.height - marginV);

                    // $digest already in progress when calling $scope.$apply()
                    // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                    $scope.$evalAsync( setSize );
                    // out('onLayoutUpdating---------------------->', scaleMode, data.center.width, data.center.height);
                }

                ////////////////////////////////////////
                // TREE 데이터 이벤트
                ////////////////////////////////////////

                /*
                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-TREE', function(e, data){
                    if(data.name == 'TREE'){
                        out('#Project.changed-TREE (screen) : ', arguments);

                        // 2. 변경 내용을 scope에 적용한다.
                        var tree = Project.current.project('TREE');
                        $scope.tree = (tree)? tree.items : [];
                    }
                });
                
                // 3. scope이 변경되었음을 감지한다.
                $scope.$watch('tree', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.tree changed (screen) : ', $scope.tree);
                    
                }, true);
                //*/

                ////////////////////////////////////////
                // DOCUMENT 데이터
                ////////////////////////////////////////
            
                // 1. 이벤트를 받는다.
                // var self = this;
                $scope.$on('#Project.changed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.changed-DOCUMENT (screen) : ', arguments);

                        // Tree는 이미 로드 완료된 상태임
                        // var tree = Project.current.project('TREE');
                        // $scope.tree = (tree)? tree.items : [];

                        // Document
                        // $scope.documents = Project.current.project('DOCUMENT');

                        // var documents = data.newValue;

                        var selectUID = Project.current.getSelectDocument();
                        __documentSelected(selectUID);
                    }
                });
                
                /*
                $scope.$watch('document', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    out('# $scope.document changed (screen) : ', $scope.document);
                    // updatedocumentList();
                }, true);
                */

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

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.selected-DOCUMENT (screen) : ', data);
                        __onSelectDocument(data.newValue, data.oldValue);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.added-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.added-DOCUMENT (screen) : ', data);
                        __onAddDocument(data.item, data.param);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.removed-DOCUMENT (screen) : ', data);
                        __onRemoveDocument(data.item, data.param);
                    }
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    if(data.name == 'DOCUMENT'){
                        out('#Project.modified-DOCUMENT (screen) : ', data);
                        __onModifyDocument(data.item, data.param);
                    }
                });

                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------
                
                function __onSelectDocument(newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    __documentSelected(newValue);
                }

                function __onAddDocument(item){

                }

                function __onRemoveDocument(item){
                    
                }

                function __onModifyDocument(item){
                    
                }

                function __documentSelected(uid){
                    
                    var documentItem;
                    if(uid){
                        //uid로 DOM 찾아내기
                        documentItem = Project.current.getDocument(uid);
                    }else{
                        documentItem = null;
                    }

                    //out('current select : ', Project.current.getSelectDocument());

                    
                    $scope.loadComplete = (documentItem && documentItem.document.content);
                    // $scope.documents = [documentItem];
                    if(documentItem == null) return;

                    var htmlString = documentItem.document.content;
                    // var html = angular.element(htmlString);

                    // $scope.documents = [htmlString];
                    // http://stackoverflow.com/questions/19415394/with-ng-bind-html-unsafe-removed-how-do-i-inject-html
                    // var bindHTML = __getHTMLContent(htmlString);
                    $scope.documents = [{content:htmlString}];

                    /*
                    // IFrame 파일로드
                    //var iframeDocument = self.bookContainer.contentWindow.document || self.bookContainer.contentDocument;
                    var iframeDocument = self.bookContainer.contentDocument;
                    iframeDocument.open('text/html', 'replace');
                    iframeDocument.write(result);
                    iframeDocument.close();
                    
                    // _onLoadComplete 이벤트 발생함
                    */
                }
                
                $scope.getHTMLContent = function (item) {
                    var htmlString = item.content;
                    return $sce.trustAsHtml(htmlString);
                }

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////
                
                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.callAPI = function(){
                    
                    var arg = U.toArray(arguments);
                    var funcName = arg.shift();
                    out(' * MENU item : ', funcName);

                    if(funcName){
                        eval(funcName).apply(null, arg);
                    }

                };

                ////////////////////////////////////////
                // API
                ////////////////////////////////////////

                function toggleScaleMode() {
                    var style;
                    var mode = scaleMode.mode();
                    if(mode == ScaleMode.SCALE_WINDOW){
                        scaleMode.scale(1);
                        style = {overflow:'auto'};
                    }else{
                        scaleMode.scale(ScaleMode.SCALE_WINDOW);
                        style = {overflow:'hidden'};
                    }
                    
                    var scale = scaleMode.scale();
                    $scope.size = getSize(1);

                    // scroll 정책 변경
                    $scope.overflow_style = style;

                    // layout 갱신
                    // $element.trigger('#view.layoutUpdate');
                    $scope.$evalAsync( setSize );
                };

                ////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////

                /*
                // Document 선택
                $scope.selectDocument = function(item, index){
                    var param = {
                        uid : item.uid
                    };
                    var command = CommandService.SELECT_DOCUMENT;
                    out('\n# [ ', command, ' ] 명령 실행');

                    CommandService.exe(command, param);
                };
                */
                
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