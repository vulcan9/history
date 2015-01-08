/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define( [ 'U' ], function( U ) {


        function _directive (Project, ELEMENT) {

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{background}} </span>',

                // templateUrl: _PATH.TEMPLATE + 'ui/element.html',
                // replace: true,
                // transclude: true,
                
                // scope: {},
                
                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////
            // Link
            ////////////////////////////////////////
            
            function Link ( $scope, $element, $attrs) {

                // alert('uid : ' + $attrs.uid);


                //--------------
                // End Link
            }

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////
            
            function Controller( $scope, $element, $attrs) {
                
                // 제거
                $scope.$on("$destroy", function () {

                    // 마우스 이벤트 제거됨
                    // $element.off('mousedown', angular.bind(this, onMousedown));
                    $element.off('click', angular.bind(this, onClick));

                    // 편집 모드 더블클릭 허용
                    // $element.off('dblclick', angular.bind(this, onDoubleClick));
                });

                // element 클릭시 선택상태로 변경
                // $element.on('mousedown', angular.bind(this, onMousedown));
                $element.on('click', angular.bind(this, onClick));

                // 편집 모드 더블클릭 허용
                // $element.on('dblclick', angular.bind(this, onDoubleClick));

                /*
                function onMousedown(e){
                    $scope.$apply(function(){
                        var selectUID = $element.attr('uid');
                        $scope.selectElement(selectUID);
                    });
                }
                */
                
                function onClick(){
                    var selectUID = $element.attr('uid');
                    
                    $scope.$apply(function(){
                        $scope.selectElement(selectUID);
                    });
                    /*
                    // 편집 모드
                    $scope.$evalAsync(function(){
                        var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                        if(scope.editableUID == selectUID) return;
                        scope.editableUID = selectUID;
                    });
                    */
                }

                /*
                // 편집모드로 진행
                function onDoubleClick(){
                    alert('onDoubleClick - 편집모드로 진행');
                    var selectUID = $element.attr('uid');
                    
                    $scope.$apply(function(){
                        $scope.selectElement(selectUID);
                    });
                    
                    $scope.$evalAsync(function(){
                        // 편집 모드
                        var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                        if(scope.editableUID == selectUID) return;
                        scope.editableUID = selectUID;
                    });
                }
                */

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 편집
                //
                ////////////////////////////////////////////////////////////////////////////////

                $scope.activateEdit = function (documentUID, elementUID) {
                        var dom = Project.current.getElement(documentUID, elementUID);
                        var type = Project.current.getType(documentUID, elementUID);
                        
                        if(type == ELEMENT.TEXT){
                            activateEdit_text(dom);

                        }else if (type == ELEMENT.IMAGE){
                            activateEdit_image(dom);
                        }
                }

                $scope.deactivateEdit = function (documentUID, elementUID) {
                        var dom = Project.current.getElement(documentUID, elementUID);
                        var type = Project.current.getType(documentUID, elementUID);

                        if(type == ELEMENT.TEXT){
                            deactivateEdit_text(dom);

                        }else if (type == ELEMENT.IMAGE){
                            deactivateEdit_image(dom);
                        }
                }

                ////////////////////////////////////////
                // ELEMENT.TEXT
                ////////////////////////////////////////

                function activateEdit_text (dom) {
                        var $dom = angular.element(dom);
                        // $dom.css('z-index', 2000);
                        $dom.attr('contenteditable', true);

                        $dom.css({
                            /*Chrome all / Safari all*/
                            '-webkit-user-select' :'initial',
                            /*Firefox all*/
                            '-moz-user-select' :'initial',
                            /*IE 10+ */
                            '-ms-user-select' :'initial',
                            /*No support for these yet, use at own risk */
                            '-o-user-select' :'initial',
                            'user-select' :'initial',

                            'background-color' : '#FFF'
                        });

                        $scope.$evalAsync(function(){
                            angular.element(dom).focus();

                            // 모두 선택 상태로
                            selectAllContents(dom);
                            // 선택 커서를 마지막 글자로 이동
                            caretToSelectEnd();
                        });

                        // 텍스트 copy&paste할때 span 태그 계속 추가되는 현상 보정
                        __addCheckForSpan($dom);
                }

                function deactivateEdit_text (dom) {
                        var $dom = angular.element(dom);
                        // $dom.css('z-index', 0);
                        $dom.attr('contenteditable', false);

                        $dom.css({
                            /*Chrome all / Safari all*/
                            '-webkit-user-select' :'none',
                            /*Firefox all*/
                            '-moz-user-select' :'none',
                            /*IE 10+ */
                            '-ms-user-select' :'none',
                            /*No support for these yet, use at own risk */
                            '-o-user-select' :'none',
                            'user-select' :'none',

                            'background-color' :'transparent'
                        });

                        // 보정 해지
                        __removeCheckForSpan($dom);
                }

                /*******************************************
                // BUG
                // W3C - ContentEditable
                // http://www.w3.org/community/editing/wiki/ContentEditable
                // Working around Chrome's contenteditable span bug
                // http://www.neotericdesign.com/blog/2013/3/working-around-chrome-s-contenteditable-span-bug
                */
                
                function __addCheckForSpan($editor) {
                    $editor.on("DOMNodeInserted", __check_SPAN);
                }
                function __removeCheckForSpan($editor) {
                    $editor.off("DOMNodeInserted", __check_SPAN);
                }
                function __check_SPAN(e) {
                    if (e.target.tagName == "SPAN" ) {
                        var helper = $("<b>helper</b>");
                        $(e.target).before(helper);
                        helper.after($(e.target).contents());
                        helper.remove();
                        $(e.target).remove();
                    }
                }

                /*******************************************/

                //--------------------------------------
                // 텍스트 선택 위치 지정
                //--------------------------------------

                // 모두 선택 상태로
                function selectAllContents (dom) {
                    var elemToSelect = dom;
                    if (window.getSelection) {
                        // all browsers, except IE before version 9
                        var selection = window.getSelection ();
                        selection.selectAllChildren (elemToSelect);
                    } else {
                        // Internet Explorer before version 9
                        var range = document.body.createTextRange ();
                        range.moveToElementText (elemToSelect);
                        range.select ();
                    }
                }

                // 글자 마지막으로 캐럿 이동
                function caretToSelectEnd () {
                    if (window.getSelection) {
                        // all browsers, except IE before version 9
                        var selection = window.getSelection ();
                        selection.collapseToEnd ();

                    } else {

                        // Internet Explorer before version 9
                        var textRange = document.selection.createRange ();
                        textRange.collapse (false);
                        textRange.select ();
                    }
                }

                ////////////////////////////////////////
                // ELEMENT.IMAGE
                ////////////////////////////////////////

                function activateEdit_image (dom) {
                }
                function deactivateEdit_image (dom) {
                }

                ////////////////////////////////////////////////////////////////////////////////
                // ELEMENT Parameter
                ////////////////////////////////////////////////////////////////////////////////

                $scope.getModifyElementParameter = function(documentUID, elementUID){

                    // type별로 수정값 다름
                    var type = Project.current.getType(documentUID, elementUID);
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var $dom = angular.element(dom);

                    var param = {
                        // 삽입될 문서
                        documentUID : documentUID,
                        elementUID: elementUID,
                        option: {},
                        // element 설정값
                        css: {
                            left: U.toNumber($dom.css('left')), 
                            top: U.toNumber($dom.css('top')), 
                            width: $dom.width(), 
                            height: $dom.height()
                        }
                    };

                    if(type == ELEMENT.TEXT){
                        // param['text'] = $dom.text();
                        param['text'] = $dom.html();

                    }else if(type == ELEMENT.IMAGE){
                        //
                    }

                    return param;
                }

                $scope.setModifyElementParameter = function(documentUID, elementUID, param){
                    var type = Project.current.getType(documentUID, elementUID);
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var $dom = angular.element(dom);

                    if(type == ELEMENT.TEXT){
                        var text = param['text'];
                        out('* Modify Content : ', text);
                        // $dom.text(text);
                        $dom.html(text);

                    }else if(type == ELEMENT.IMAGE){
                        //
                    }
                }

                //--------------
                // End Controller
            }

            ////////////////////////////////////////
            // end directive
            ////////////////////////////////////////
        }

        // 리턴
        _directive._regist = function(application){
            // 등록
            application.directive( 'element', _directive );
        };
        return _directive;
    }
);
