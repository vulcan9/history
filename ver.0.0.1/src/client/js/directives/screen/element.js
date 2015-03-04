/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : UI 컨트롤을 위한 기능 구현

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {


        function _directive(Project, ELEMENT, $compile, $interpolate) {

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

            function Link($scope, $element, $attrs) {
                // alert('uid : ' + $attrs.uid);
                // End Link
            }

            ////////////////////////////////////////
            // Controller
            ////////////////////////////////////////

            function Controller($scope, $element, $attrs) {

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

                function onClick() {
                    var selectUID = $element.attr('uid');

                    $scope.$apply(function () {
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

                //--------------------------------------------------
                // css prefix 적용 지원 prefix Attribute (content.js)
                //--------------------------------------------------

                // prefix 처리가 필요한 css style 목록
                //var _prefix_list = [
                //    'column-count', 'columnCount',
                //    'column-rule', 'columnRule',
                //    'column-gap', 'columnGap'
                //];

                //*
                //$scope.styles = {};
                //$scope.styleString =  ($element.attr('style-string') == undefined)? '' : $attrs['styleString'];

                //$scope.styleString =  $attrs['styleString'] || '{}';
                //if($attrs['style-string'] == undefined) $element.attr('style-string', '{}');

                //$scope.setStyle = function (styleName, value){
                //    // 오리지널 데이터 저장
                //    var styleString = $element.attr('style-string') || '{}';
                //    var obj = angular.fromJson(styleString);
                //    obj[styleName] = value;
                //    $element.attr('style-string', angular.toJson(obj));

                    //$element.css(obj);


                    /*
                    var obj = ($scope.styleString)? angular.fromJson($scope.styleString):{};
                    $element.attr('style-string')
                    obj[styleName] = value;
                    $scope.styleString = angular.toJson(obj);

                    // prefix 적용된 style 적용
                    $scope.styles[styleName] = value;
                    */
                //}

                checkStyle();

                function checkStyle(){
                    var styleString = $element.attr('style-string');
                    if(styleString){
                        var obj = angular.fromJson(styleString);
                        $element.css(obj);
                    }
                }





                //$scope.$watch('styles', function(newValue, oldValue){
                //    if(newValue == oldValue) return;
                //    out('styles : ', newValue);
                //
                //    //var prefixedStyles = newValue;
                //    //$scope.styles = angular.toJson(prefixedStyles);
                //}, true);

                //$scope.styles = angular.fromJson($scope.styleString);
                //$element.attr('style-string', $interpolate('{{styleString}}'));
                //$compile($element, $scope);

                //$scope.$watch('styleString', function(newValue, oldValue){
                //    if(newValue == oldValue) return;
                //    //$element.attr('style-string', newValue);
                //});

                /*/

                $scope.styles = checkStyle();
                $scope.setStyle = function (styleName, value){
                    // prefix 적용된 style 적용
                    $scope.styles[styleName] = value;
                }
                 function checkStyle(){
                 var styleString = $attrs['style'];
                 if(styleString){
                 //styleString = styleString.replace(/-[ms|webkit|moz|o]+-(.*?:)(.*?)(?=[;|\"])/g, '-ms-$1$2;-moz-$1$2;-o-$1$2;-webkit-$1$2;$1$2');
                 styleString = styleString.replace(/-[ms|webkit|moz|o]+-(.*?:)(.*?)(?=[;|\"])/g, '$1$2');
                 //$attrs['style'] = styleString;


                 var obj = {};
                 var tocken = styleString.split(';');
                 for(var prop in tocken){
                 if(!tocken[prop].trim()) continue;
                 var style = tocken[prop].split(':');
                 var key = style[0].trim();
                 var value = style[1].trim();
                 if(key) obj[key] = value;
                 }
                 return obj;
                 }
                 }
                /*/

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 편집
                //
                ////////////////////////////////////////////////////////////////////////////////

                $scope.activateEdit = function (documentUID, elementUID) {
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var type = Project.current.getType(documentUID, elementUID);

                    // 편집 전 상태 캡쳐
                    var $dom = angular.element(dom);
                    $dom.addClass('edit');

                    if (type == ELEMENT.TEXT) {
                        activateEdit_text(dom);

                    } else if (type == ELEMENT.IMAGE) {
                        activateEdit_image(dom);
                    }
                }

                $scope.deactivateEdit = function (documentUID, elementUID) {
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var type = Project.current.getType(documentUID, elementUID);

                    var $dom = angular.element(dom);
                    $dom.removeClass('edit');

                    if (type == ELEMENT.TEXT) {
                        deactivateEdit_text(dom);

                    } else if (type == ELEMENT.IMAGE) {
                        deactivateEdit_image(dom);
                    }
                }

                ////////////////////////////////////////
                // ELEMENT.TEXT
                ////////////////////////////////////////

                function activateEdit_text(dom) {
                    var $dom = angular.element(dom);
                    // $dom.css('z-index', 2000);
                    $dom.attr('contenteditable', true);

                    $scope.$evalAsync(function () {
                        angular.element(dom).focus();

                        // 모두 선택 상태로
                        selectAllContents(dom);
                        // 선택 커서를 마지막 글자로 이동
                        caretToSelectEnd();
                    });

                    // 텍스트 copy&paste할때 span 태그 계속 추가되는 현상 보정
                    __addCheckForSpan($dom);
                }

                function deactivateEdit_text(dom) {
                    var $dom = angular.element(dom);
                    // $dom.css('z-index', 0);
                    $dom.attr('contenteditable', false);

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
                    // $editor.on("DOMNodeInserted", __check_SPAN);
                    // $editor.on("keydown", __check_newline);
                    // $editor.on("keyup", __check_DIV);

                    $editor.on("keydown", __check_keydown);
                    $editor.on("keyup", __check_keyup);
                }

                function __removeCheckForSpan($editor) {
                    // $editor.off("DOMNodeInserted", __check_SPAN);
                    // $editor.off("keydown", __check_newline);
                    // $editor.off("keyup", __check_DIV);

                    $editor.off("keydown", __check_keydown);
                    $editor.off("keyup", __check_keyup);
                }

                function __check_keydown(e) {
                    var $editor = $(e.target);
                    var text = $editor.html();

                    // console.log('keydown:', text);

                    // 직접 <br>코드를 삽입한다. - (그러면 DIV 추가 안됨)
                    // 커서는 손대지 않는다.
                    if (e.which == 13) {

                        var newline = document.createElement("br");
                        // var newline = document.createTextNode("\n");

                        if (window.getSelection) {
                            // all browsers, except IE before version 9
                            var selection = window.getSelection();
                            if (selection.rangeCount > 0) {
                                var range = selection.getRangeAt(0);
                                range.collapse(false);
                                range.insertNode(newline);

                                //*
                                range.setStartAfter(newline);
                                range.setEndAfter(newline);
                                selection.removeAllRanges();
                                selection.addRange(range);
                                /*/
                                 // node value ; text or \n or ""
                                 var node = newline.nextSibling;
                                 if(node){
                                 selection.collapse (node, 0);
                                 }else{
                                 // selection.collapseToEnd ();
                                 selection.collapse (selection.anchorNode, selection.anchorOffset+1);
                                 }
                                 //*/
                            }
                        }

                        // 노드 normalize
                        e.target.normalize();
                        e.preventDefault();
                    }
                }

                function __check_keyup(e) {

                    var $editor = $(e.target);
                    var newline = document.createElement("br");
                    // var newline = document.createTextNode("\n");

                    // 줄바꿈 엔터 칠때 많이 발생하나 __check_keydown 메서드 실행으로
                    //  거의 발생되지 않음 (COPY & PASTE 실행시를 위해 남겨둠)

                    //remove all span tags, keeping the content
                    $editor.find('span').contents().unwrap();
                    //add a br at the start of each p or div, then remove p or div 
                    //use append instead of prepend to add the  line break at the end, not at the start.
                    $editor.find('p, div').prepend(newline).contents().unwrap();
                    // $editor.find('br').before(newline).remove();

                    // COPY & PASTE 할때 보정
                    var text = $editor.html();
                    if (text.search(/[\r\n]/) > -1) {
                        // \r\n 처리
                        text = text.replace(/[\r\n]/g, '<br>');
                        $editor.html(text);
                    }
                    $editor.find('br').removeAttr('style');

                    // 컨텐츠의 마지막 요소가 br이 아닌 경우 
                    // 마지막 라인에서 엔터를 두번쳐야 줄바뀜이 일어나는 현상때문에
                    // 항상 br 태그를 마지막에 둠
                    var $last = $editor.contents().last();
                    if (!$last.is('br')) {
                        $last.after(newline);
                    }

                    // 노드 normalize
                    e.target.normalize();
                    e.preventDefault();
                }

                /*
                 // 엔터 줄바꿈의 경우 (부모 태그가 div인 경우)
                 // <div><span>...</div></span> 형식으로 문자열이 분리되면서 태그로 감싸지게 된다.
                 // 이후 <br> 태그가 붙는다.

                 // \r\n 처리
                 text = text.replace(/[\r\n]/g, '');
                 // SPAN 처리
                 text = text.replace(/<\s*\/?\s*S\s*P\s*A\s*N\s*.*?>/gi, '');
                 // DIV --> <br>처리
                 text = text.replace(/<\s*D\s*I\s*V\s*.*?>/gi, '<br>');
                 text = text.replace(/<\s*\/\s*D\s*I\s*V\s*>/gi, '');

                 // DIV --> '' 처리
                 // text = text.replace(/<\s*\/?\s*D\s*I\s*V\s*.*?>/gi, '');

                 // 노드 normalize
                 e.target.normalize();


                 function __check_SPAN(e) {
                 if (e.target.tagName == "SPAN" ) {
                 var helper = $("<b>__helper__</b>");
                 $(e.target).before(helper);
                 helper.after($(e.target).contents());
                 helper.remove();
                 $(e.target).remove();
                 }
                 }
                 */

                /*******************************************/

                //--------------------------------------
                // 텍스트 선택 위치 지정
                //--------------------------------------

                // 모두 선택 상태로
                function selectAllContents(dom) {
                    var elemToSelect = dom;
                    if (window.getSelection) {
                        // all browsers, except IE before version 9
                        var selection = window.getSelection();
                        selection.selectAllChildren(elemToSelect);
                    } else {
                        // Internet Explorer before version 9
                        var range = document.body.createTextRange();
                        range.moveToElementText(elemToSelect);
                        range.select();
                    }
                }

                // 글자 마지막으로 캐럿 이동
                function caretToSelectEnd() {
                    if (window.getSelection) {
                        // all browsers, except IE before version 9
                        var selection = window.getSelection();
                        selection.collapseToEnd();

                    } else {

                        // Internet Explorer before version 9
                        var textRange = document.selection.createRange();
                        textRange.collapse(false);
                        textRange.select();
                    }
                }

                ////////////////////////////////////////
                // ELEMENT.IMAGE
                ////////////////////////////////////////

                function activateEdit_image(dom) {
                }

                function deactivateEdit_image(dom) {
                }

                ////////////////////////////////////////////////////////////////////////////////
                // ELEMENT Parameter
                ////////////////////////////////////////////////////////////////////////////////

                $scope.getModifyElementParameter = function (documentUID, elementUID) {

                    // type별로 수정값 다름
                    var type = Project.current.getType(documentUID, elementUID);
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var $dom = angular.element(dom);

                    var param = {
                        // 삽입될 문서
                        documentUID: documentUID,
                        elementUID: elementUID,
                        option: {},
                        // element 설정값
                        css: {
                            left: $dom.css('left'),
                            top: $dom.css('top'),
                            width: $dom.outerWidth() + 'px',
                            height: $dom.outerHeight() + 'px'
                        }
                    };

                    if (type == ELEMENT.TEXT) {
                        // param['text'] = $dom.text();
                        param['text'] = $dom.html();

                    } else if (type == ELEMENT.IMAGE) {
                        //
                    }

                    return param;
                }

                $scope.setModifyElementParameter = function (documentUID, elementUID, param) {
                    var type = Project.current.getType(documentUID, elementUID);
                    var dom = Project.current.getElement(documentUID, elementUID);
                    var $dom = angular.element(dom);

                    if (type == ELEMENT.TEXT) {
                        var text = param['text'];
                        if (text !== undefined) {
                            out('* Modify Content : ', text);
                            $dom.html(text);
                            // $dom[0].normalize();
                        }

                    } else if (type == ELEMENT.IMAGE) {
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
        _directive._regist = function (application) {
            // 등록
            application.directive('element', _directive);
        };
        return _directive;
    }
);
