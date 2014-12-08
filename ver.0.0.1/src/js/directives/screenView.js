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
        function _directive($document, ScaleMode) {

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

                controller: Controller,
                link: Link

            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller ( $scope, $element, $attrs, Project , CommandService) {

                ////////////////////////////////////////
                // DOCUMENT 데이터
                ////////////////////////////////////////

                // 1. 이벤트를 받는다.
                var self = this;
                $scope.$on('#Project.changed-DOCUMENT', function(e, data){
                    out('#Project.changed-DOCUMENT (screen) : ', arguments);

                    // Tree는 이미 로드 완료된 상태임
                    // var tree = Project.current.project('TREE');
                    // $scope.tree = (tree)? tree.items : [];

                    var selectUID = Project.current.getSelectDocument();
                    self._updateDocumentContent(selectUID);
                });
                
                // var data = {data:project};
                $scope.$on('#Project.initialized', function(e, data){
                    // $scope.tree = Project.current.project('TREE');
                    // $scope.document = Project.current.project('DOCUMENT');
                });

                ////////////////////////////////////////////////////////////////////////////////
                // Document
                ////////////////////////////////////////////////////////////////////////////////
                
                //var data = {data:dataOwner, item:itemObject, name:propertyName, oldValue:oldValue};
                $scope.$on('#Project.selected-DOCUMENT', function(e, data){
                    out('#Project.selected-DOCUMENT (screen) : ', data);
                    self.__onSelectDocument(data.newValue, data.oldValue);
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
                
                ////////////////////////////////////////
                // DOM 업데이트
                ////////////////////////////////////////
                
                this.__onSelectDocument = function (newValue, oldValue){
                    out(' - oldValue : ', oldValue);
                    out(' - newValue : ', newValue);

                    $scope.loadComplete = false;
                    self._updateDocumentContent(newValue);
                }

                function __onAddDocument(item){

                }

                function __onRemoveDocument(item){
                    
                }

                function __onModifyDocument(item){
                    
                }

                //-------------------------------------
                // 내용 갱신
                //-------------------------------------

                this._updateDocumentContent = function (documentUID){

                    //uid로 DOM 찾아내기
                    var documentItem = documentUID ? Project.current.getDocument(documentUID) : null;
                    // $scope.loadComplete = (documentItem && documentItem.document.content);
                    
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
                this._getContentContainer = function (documentUID){
                    // var $document = $element.find('[uid=' + documentUID + ']');
                    var $content = $element.find('#contentContainer');
                    return $content;
                }

                // 해당 문서의 Element DOM 찾기
                this._getContentElement = function (elementUID, documentUID){
                    var $contentContainer = this._getContentContainer(documentUID);
                    var $el = $contentContainer.find('[uid=' + elementUID + ']');
                    return $el;
                }

                ////////////////////////////////////////////////////////////////////////////////
                // Element
                ////////////////////////////////////////////////////////////////////////////////
                
                // {newValue: "element-18d53f95-2ffa-433a-9a9a-c57ca1534f04", name: "ELEMENT", oldValue: "element-c2d5091c-3d06-470c-b7b0-343a8bd41c88", document: "document-9c2bd172-edbe-4ed3-a145-c7e25dc515d1"}
                $scope.$on('#Project.selected-ELEMENT', function(e, data){
                    out('#Project.selected-ELEMENT (screen) : ', data);
                    self.__onSelectElement(data.newValue, data.oldValue, data.documentUID);
                });

                $scope.$on('#Project.added-ELEMENT', function(e, data){
                    out('#Project.addeded-ELEMENT (screen) : ', data);
                    self.__onAddElement(data.item, data.param);
                });
                
                ////////////////////////////////////////
                // Element 업데이트
                ////////////////////////////////////////
                
                this.__onSelectElement = function (newValue, oldValue, documentUID){
                    out(' - oldValue (element) : ', oldValue);
                    out(' - newValue (element) : ', newValue);

                    // 해당 문서에 선택 표시

                    // addElement 후 바로 선택되는 경우 $element에 아직 렌더링 되지 않은 상황일 수 있다.
                    var $el_old = this._getContentElement(oldValue, documentUID)
                    $el_old.removeClass('selectedElement');

                    var $el_new = this._getContentElement(newValue, documentUID)
                    $el_new.addClass('selectedElement');

                    // UI 크기 업데이트
                   this._updateSelectUI();
                }

                this._updateSelectUI = function (){
                    if(Project.current == null) return;
                    var selectUID = Project.current.getSelectElement();
                    var documentUID = Project.current.getSelectDocument();

                    out('_updateSelectUI : ', selectUID);
                    // $scope.documentUID = documentUID;
                    $scope.selectInfo = {
                        uid: selectUID,
                        scale: $scope.size.scale
                    };

                    /*
                    var $select = this._getContentElement(selectUID, documentUID);
                    if($select.length < 1){
                        $scope.boundary = null;
                        return;
                    }

                    // 편집 UI를 구성한다.
                    var boundary = {
                        elementUID: selectUID,
                        documentUID: documentUID,

                        // scale: $scope.size.scale,

                        x: U.toNumber($select.css('left')),
                        y: U.toNumber($select.css('top')),
                        
                        width: $select.outerWidth(),
                        height: $select.outerHeight()
                    }

                    $scope.boundary = boundary;
                    */



                    // 1. 선택된 uid를 ui-canvas directive에 전달한다.
                    // 2. 선택 uid를 가지고 boundary를 구한다.
                    // 3. boundary에 따라 ui를 세팅한다.
                    // 4. 사용자 동작을 구성한다.(마우스)
                    // 5. 사용자 동작에 따라 command를 실행한다.
                    // 6. 선택상태를 바꾼다
                    // 7. 그룹 선택을 지원한다.

                    // ---> directive로 구성할것
                }

                $scope.getBoundary = function(uid){
                    return ('getBoundary : ' + uid);
                }

                this.__onAddElement = function (item, param){
                    // this._updateDocumentContent(param.documentUID);

                    // var self = this;
                    // $scope.$evalAsync(function(){
                    //     self._updateSelectUI();
                    // });
                }

                ////////////////////////////////////////
                // End Controller
                ////////////////////////////////////////
            }

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Link
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Link($scope, $element, $attrs, controller){

                //-----------------------------------
                // 로드 완료 체크
                //-----------------------------------
                
                $scope.loadComplete = false;

                $scope.onLoadComplete = function(success){
                    $scope.loadComplete = success;
                };

                //-----------------------------------
                // 용지 크기 체크
                //-----------------------------------

                $scope.$watch('size', function(newValue, oldValue) {
                    $scope.alignInfo_paper = getAlignInfo_paper(newValue);
                    controller._updateSelectUI();
                }, true);

                // A4 : 595x842, ppt : 1193x671

                // margin은 (.paper) class 설정치를 참고할것
                var marginW = 70;
                var marginH = 70;
                var sourceWidth = Project.paper.width;
                var sourceHeight = Project.paper.height;
                var compareWidth = Math.max(0, sourceWidth - marginW);
                var compareHeight = Math.max(0, sourceHeight - marginH);

                $scope.scaleMode = new ScaleMode({
                    sourceWidth: sourceWidth,
                    sourceHeight: sourceHeight,
                    compareWidth: Math.max(0, $element.width() - marginW),
                    compareHeight: Math.max(0, $element.height() - marginH)
                });

                $scope.scaleMode.scale(ScaleMode.SCALE_WINDOW);
                $scope.size = getSize(1);
                
                //-----------------------------------
                // Scale 연산
                //-----------------------------------

                function getSize(scale){
                    var sizeObj={
                        scale: scale,
                        sourceWidth: sourceWidth,
                        sourceHeight: sourceHeight,
                        compareWidth: compareWidth,
                        compareHeight: compareHeight,

                        // width: sourceWidth*scale,
                        // height: sourceHeight*scale,
                        width: Math.ceil(sourceWidth*scale),
                        height: Math.ceil(sourceHeight*scale),
                        marginW : marginW,
                        marginH : marginH
                    };
                    return sizeObj;
                }

                function setSize(){
                    $scope.scaleMode.set({
                        sourceWidth: sourceWidth,
                        sourceHeight: sourceHeight,
                        compareWidth: compareWidth,
                        compareHeight: compareHeight
                    });

                    var scale = $scope.scaleMode.scale();
                    $scope.size = getSize(scale);

                    // 위치 업데이트 호출 (alignModule)
                    $document.trigger('#window.resize'); 
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

                ////////////////////////////////////////////////////////////////////////////////
                // DOM 인터렉션
                ////////////////////////////////////////////////////////////////////////////////

                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // DOM에서 API 호출하는 방법
                // callAPI('toggleScaleMode')

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.callAPI = function(){
                    
                    var arg = U.toArray(arguments);
                    var funcName = arg.shift();
                    out(' * Call api : ', funcName);

                    if(funcName){
                        eval(funcName).apply(null, arg);
                    }

                };

                ////////////////////////////////////////
                // API
                ////////////////////////////////////////

                //-----------------------
                // Scale Mode 변경
                //-----------------------
                
                function toggleScaleMode() {
                    var style;
                    var mode = $scope.scaleMode.mode();
                    if(mode == ScaleMode.SCALE_WINDOW){
                        $scope.scaleMode.scale(1);
                        style = {overflow:'auto'};
                    }else{
                        $scope.scaleMode.scale(ScaleMode.SCALE_WINDOW);
                        style = {overflow:'hidden'};
                    }
                    
                    // var scale = $scope.scaleMode.scale();
                    // $scope.size = getSize(1);

                    // scroll 정책 변경
                    $scope.overflow_style = style;

                    // layout 갱신
                    // $element.trigger('#view.layoutUpdate');
                    $scope.$evalAsync( setSize );
                };

                function setScaleMode(scaleNum){
                    $scope.scaleMode.scale(scaleNum);

                    // scroll 정책 변경
                    var style = {overflow:'auto'};
                    $scope.overflow_style = style;

                    // layout 갱신
                    $scope.$evalAsync( setSize );
                }

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end _directive
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





                    ////////////////////////////////////////////////////////////////////////////////
                    //
                    // 화면 업데이트
                    // 
                    ////////////////////////////////////////////////////////////////////////////////

                    //------------------
                    // 데이터 변경된 경우 화면 업데이트
                    //------------------

                    // function updatedocumentList(){
                        
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
                    // }

