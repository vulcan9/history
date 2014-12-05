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

            function Controller ( $scope, $element, $attrs, Project , CommandService, $document, ScaleMode, $sce, $timeout, $compile) {

                // 로드 완료 체크
                $scope.loadComplete = false;

                //-----------------------------------
                // Background Pattern, align-center 데이터
                // Svg Attribute (ng-attr-xxx 사용해야함)
                // bug patch : http://alexandros.resin.io/angular-d3-svg/
                //-----------------------------------

                $scope.$watch('size', function(newValue, oldValue) {
                    $scope.ratio = getRatio(newValue.scale);
                    $scope.alignInfo_paper = getAlignInfo_paper(newValue);
                    $scope.alignInfo_loading = getAlignInfo_loading(newValue);
                }, true);

                // A4 : 595x842, ppt : 1193x671

                // margin은 (.paper) class 설정치를 참고할것
                var marginW = 70;
                var marginH = 70;
                var sourceWidth = Project.paper.width;
                var sourceHeight = Project.paper.height;
                var compareWidth = Math.max(0, sourceWidth - marginW);
                var compareHeight = Math.max(0, sourceHeight - marginH);

                $scope.size = getSize(1);
                $scope.stroke = 1;
                
                // 배경 패턴을 그리기 위한 위치 정보
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
                // Align 연산
                //-----------------------------------

                // 가로/세로 중앙 정렬을 위한 위치 정보
                function getAlignInfo_paper(scale){
                    var parent = $element.parent();
                    var paddingW = (U.toNumber(parent.css('padding-left')) || 0) + (U.toNumber(parent.css('padding-right')) || 0);
                    var paddingH = (U.toNumber(parent.css('padding-top')) || 0) + (U.toNumber(parent.css('padding-bottom')) || 0);

                    var marginW = (U.toNumber($element.css('margin-left')) || 0)  + (U.toNumber($element.css('margin-right')) || 0);
                    var marginH = (U.toNumber($element.css('margin-top')) || 0) + (U.toNumber($element.css('margin-bottom')) || 0);

                    var alignInfo={
                        
                        // 가로/세로 적용 및 데이터 저장  변수명 지정
                        // type: 'both', // horizontal | vertical | both | undefined (=both)
                        // visibleDelayTime:500,

                        parentWidth: compareWidth - paddingW,
                        parentHeight: compareHeight - paddingH,
                        width: scale.width + marginW,
                        height: scale.height + marginH
                    };

                    // out('alignInfo : ', alignInfo);
                    return alignInfo;
                }

                // 가로/세로 중앙 정렬을 위한 위치 정보
                function getAlignInfo_loading(scale){
                    var parent = $element.parent();
                    var paddingW = (U.toNumber(parent.css('padding-left')) || 0) + (U.toNumber(parent.css('padding-right')) || 0);
                    var paddingH = (U.toNumber(parent.css('padding-top')) || 0) + (U.toNumber(parent.css('padding-bottom')) || 0);

                    var alignInfo={
                        
                        // 가로/세로 적용 및 데이터 저장  변수명 지정 (default=both)
                        // type: 'both', // horizontal | vertical | both | undefined (=both)

                        // 초기 visible 설정 지연 millisecond (default=0)
                        visibleDelayTime:500,

                         // 아래 설정값은 생략 가능 
                         // 생략시 현재 dom 상태 기준으로 자동 계산 되어짐
                         // 따라서 transition이 적용되고 있다면 아래값들을 설정하여  최종 결과값을 알려주어야함
                        parentWidth: scale.width - paddingW,
                        parentHeight: scale.height - paddingH
                        // width: scale.width + marginW,
                        // height: scale.height + marginH
                    };

                    // out('loading alignInfo : ', alignInfo);
                    return alignInfo;
                }

                //-----------------------------------
                // Scale 연산
                //-----------------------------------

                var scaleMode = new ScaleMode({
                    sourceWidth: sourceWidth,
                    sourceHeight: sourceHeight,
                    compareWidth: Math.max(0, $element.width() - marginW),
                    compareHeight: Math.max(0, $element.height() - marginH)
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
                        marginW : marginW,
                        marginH : marginH
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
                    compareWidth = Math.max(0, data.center.width - marginW);
                    compareHeight = Math.max(0, data.center.height - marginH);

                    // $digest already in progress when calling $scope.$apply()
                    // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                    $scope.$evalAsync( setSize );
                }
                
                // 제거
                $scope.$on("$destroy", function () {
                    $document.off('#dock.layoutUpdating', __onLayoutUpdating);
                });

                ////////////////////////////////////////
                // DOCUMENT 데이터
                ////////////////////////////////////////
            
                // 1. 이벤트를 받는다.
                // var self = this;
                $scope.$on('#Project.changed-DOCUMENT', function(e, data){
                    out('#Project.changed-DOCUMENT (screen) : ', arguments);

                    // Tree는 이미 로드 완료된 상태임
                    // var tree = Project.current.project('TREE');
                    // $scope.tree = (tree)? tree.items : [];

                    var selectUID = Project.current.getSelectDocument();
                    __documentSelected(selectUID);
                });
                
                //-------------------------------------
                // DOM 업데이트
                //-------------------------------------
                
                // var data = {data:project};
                $scope.$on('#Project.initialized', function(e, data){
                    // $scope.tree = Project.current.project('TREE');
                    // $scope.document = Project.current.project('DOCUMENT');
                });

                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    out('#Project.selected-DOCUMENT (screen) : ', data);
                    __onSelectDocument(data.newValue, data.oldValue);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.added-DOCUMENT', function(e, data){
                    out('#Project.added-DOCUMENT (screen) : ', data);
                    __onAddDocument(data.item, data.param);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.removed-DOCUMENT', function(e, data){
                    out('#Project.removed-DOCUMENT (screen) : ', data);
                    __onRemoveDocument(data.item, data.param);
                });

                // var data = {data:dataOwner, item:itemObject, name:propertyName};
                $scope.$on('#Project.modified-DOCUMENT', function(e, data){
                    out('#Project.modified-DOCUMENT (screen) : ', data);
                    __onModifyDocument(data.item, data.param);
                });
                
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
                    contentRefresh(uid);
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

                // 내용 갱신
                function contentRefresh(documentUID){

                    //uid로 DOM 찾아내기
                    var documentItem = documentUID ? Project.current.getDocument(documentUID) : null;
                    $scope.loadComplete = (documentItem && documentItem.document.content);
                    
                    if(documentItem == null) {
                        $scope.documents = [];
                        return;
                    }

                    var dom = documentItem.document.content;
                    var html = Project.current.htmlToString(dom);
                    
                    $scope.documents = [{
                        uid: documentUID, 
                        content: dom,
                        originalHTML: html
                    }];

                    /*
                    // 랜더링 타임을 기다렸다가 DOM 적용함
                    $timeout(function(){
                        $element.find('#contentContainer').html(dom);
                    });
                    */
                }
                
                // HTML Content 바인딩
                $scope.getHTMLContent = function (item) {
                    // var htmlString = item.content;
                    // return $sce.trustAsHtml(htmlString);

                    // attribute에 uid값이 아직 적용되지 않은 경우일 수 있으므로 $evalAsync로 실행한다.
                    $scope.$evalAsync(function(){
                        
                        var documentUID = item.uid
                        var $contentContainer = getContentContainer(documentUID);
                        
                        var dom = item.content;
                        $contentContainer.html(dom);
                    });
                }

                /*
                $scope.$watch('documents', function(newValue, oldValue) {
                    if (newValue === oldValue) { return; }
                    __onDocumentChanged(newValue, oldValue);
                }, true);
                
                function __onDocumentChanged(newValue, oldValue){
                    out('__onDocumentChanged : ', newValue);
                }
                */

                // 로드 내용 container DOM 찾기
                function getContentContainer(documentUID){
                    var $document = $element.find('[uid=' + documentUID + ']');
                    var $content = $document.find('#contentContainer');
                    return $content;
                }

                // 해당 문서의 Element DOM 찾기
                function getContentElement(elementUID, documentUID){
                    var $contentContainer = getContentContainer(documentUID);
                    var $el = $contentContainer.find('[uid=' + elementUID + ']');
                    return $el;
                }

                //-------------------------------------
                // Element 업데이트
                //-------------------------------------
                
                // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
                $scope.$on('#Project.selected-ELEMENT', function(e, data){
                    out('#Project.selected-ELEMENT (screen) : ', data);
                    __onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });

                $scope.$on('#Project.added-ELEMENT', function(e, data){
                    out('#Project.addeded-ELEMENT (screen) : ', data);
                    __onAddElement(data.item, data.param);
                });
                
                function __onSelectElement(newValue, oldValue, documentUID){
                    out(' - oldValue (element) : ', oldValue);
                    out(' - newValue (element) : ', newValue);

                    // 해당 문서에 선택 표시

                    // addElement 후 바로 선택되는 경우 $element에 아직 렌더링 되지 않은 상황일 수 있다.
                    var $el_old = getContentElement(oldValue, documentUID)
                    $el_old.removeClass('selectedElement');

                    var $el_new = getContentElement(newValue, documentUID)
                    $el_new.addClass('selectedElement');






                    // // 편집 UI를 구성한다.
                    // var editBoundary = {
                    //     x: 0,
                    //     y: 0,
                    //     width: 100,
                    //     height: 100,
                    //     elementUID: newValue,
                    //     documentUID: 
                    // }

                    // $scope.edit = editBoundary;
























                }

                function __onAddElement(item, param){
                    contentRefresh(param.documentUID);
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