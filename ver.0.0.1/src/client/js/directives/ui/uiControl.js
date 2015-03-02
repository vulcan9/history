/*////////////////////////////////////////////////////////////////////////////////

 *
 * Developer : (c) Dong-il Park (pdi1066@naver.com)
 * Project : HI-STORY (https://github.com/vulcan9/history)
 * Description : UI 컨트롤을 위한 기능 구현

 ////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(['U'], function (U) {




        // 선언
        function _directive(Drager, Resizer, Rotator, Snap, CommandService, Project, Tool, $timeout, ELEMENT, $getScope) {

            //out( 'version' );

            return {

                // DOM 엘리먼트의 속성 : EACM (default - A)
                // element, attribute, class, comment
                restrict: 'EA',

                // templateUrl을 사용할 경우 index.html 위치를 기준으로 로드할 html의 상대위치를 정의합니다.
                //template: '<span><span ng-transclude></span> {{version}} </span>',
                templateUrl: _PATH.TEMPLATE + 'ui/uiControl.html',

                replace: true,
                transclude: true,
                scope: {
                    selectInfo: '=selectInfo',
                    item: '=item'
                },

                controller: Controller,
                link: Link
            };

            ////////////////////////////////////////////////////////////////////////////////
            //
            // Controller
            //
            ////////////////////////////////////////////////////////////////////////////////

            function Controller($scope, $element, $attrs) {

                ////////////////////////////////////////
                // 환경 설정값
                ////////////////////////////////////////

                //-------------------
                // 텍스트 크기 맞춤 옵션
                //-------------------
                /*
                 $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                 $scope.display_size_toText = data.newValue;
                 });
                 */

                //-------------------
                // snap 크기
                //-------------------

                $scope.$on('#Tool.changed-CONFIG.display.snap_pixel', function (e, data) {
                    $scope.snap_pixel = data.newValue;
                });

                $scope.$watch('snap_pixel', function (newValue, oldValue) {
                    // snap 속성 업데이트
                    var sensitive = (newValue || newValue > 1) ? newValue : 1;
                    _snap.update('sensitive', sensitive);
                });

                function _setElementOption() {

                    // Tool 지정값
                    $scope.snap_pixel = Tool.current.config_display('snap_pixel');

                    // 개별 지정 옵션
                    //var api = Project.current.elementAPI ();
                    //$scope.display_size_toText = api.option('display_size_toText');
                }

                ////////////////////////////////////////
                // 기능 설정
                ////////////////////////////////////////

                var self = this;
                $scope.transition = true;
                $scope.selected = false;

                $scope.$watch('selected', function (newValue, oldValue) {
                    //**************************

                    $scope.draggable = newValue;
                    $scope.resizable = newValue;
                    $scope.rotatable = newValue;

                    $element.off('dblclick', angular.bind(this, onDoubleClick));

                    //**************************

                    if (!newValue) return;

                    // 설정값 갱신
                    _setElementOption();

                    // 편집 모드 더블클릭 허용
                    $element.on('dblclick', angular.bind(this, onDoubleClick));
                });

                $scope.$watch('draggable', function (newValue, oldValue) {
                    __updateDraggable(newValue);
                });

                $scope.$watch('resizable', function (newValue, oldValue) {
                    __updateResizable(newValue);
                });

                $scope.$watch('rotatable', function (newValue, oldValue) {
                    __updateRotatable(newValue);
                });

                // 편집모드로 진행
                function onDoubleClick() {
                    // alert('onDoubleClick - 편집모드로 진행');
                    var selectUID = Project.current.getSelectElement();
                    if ($scope.editableUID == selectUID) return;

                    // 편집 모드
                    $scope.$apply(function () {
                        // var scope = $getScope('.ui-draggable-handle, .ui-resizable-handle', 'uiControl')
                        $scope.editableUID = selectUID;
                    });
                }

                ////////////////////////////////////////////////////////////////////////////////
                // 선택 상태 표시 업데이트
                ////////////////////////////////////////////////////////////////////////////////

                $scope.$on('#Project.select-DOCUMENT', function (e, data) {

                    // Document 선택이 바뀌기 전에 edit 모드 해지
                    if ($scope.editableUID) {
                        // BUG : editable 상태가 적용되지 않는 현상이 있어 직접 코드를 실행시켜준다.
                        // $scope.$apply 등의 방법은 가끔 에러를 발생 시킨다.
                        // var elementUID = Project.current.getSelectElement();
                        // var elementUID = $scope.editableUID;
                        // $scope.editableUID = '';
                        // $scope._checkEditable('', elementUID);
                        // $scope.$apply();

                        // $scope.$evalAsync(function() {
                        //     $scope.editableUID = '';
                        // });

                        // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                        // if($scope.$$phase !== '$digest'){
                        //     $scope.$digest()
                        // }
                    }
                });

                // 선택 변경 작업 중에는 transition 없앰
                var _notUseTransition = false;

                $scope.$on('#Project.select-ELEMENT', function (e, data) {
                    // 편집 모드 해지
                    $scope.editableUID = '';
                });
                $scope.$on('#Project.selected-ELEMENT', function (e, data) {

                    // selectInfo 변경에 의해 아래 watch 실행됨
                    _notUseTransition = true;

                    // 설정값 갱신
                    _setElementOption();

                    //----------------------
                    // 해당 DOM에 선택 표시
                    //----------------------
                    /*
                     // addElement 후 바로 선택되는 경우 $element에 아직 렌더링 되지 않은 상황일 수 있다.
                     var el_old = Project.current.getElement(data.documentUID, data.oldValue)
                     angular.element(el_old).removeClass('selectedElement');

                     var el_new = Project.current.getElement(data.documentUID, data.newValue)
                     angular.element(el_new).addClass('selectedElement');
                     */
                    /*
                     $timeout(function(){
                     __updateBoundary();
                     }, 10);
                     */
                    // target 변경
                    if (_resizeUtil) _resizeUtil.proxyTarget = getSelectTarget(data.newValue);
                });

                $scope.$on('#Project.remove-ELEMENT', function (e, data) {
                    // 편집 모드 해지
                    $scope.editableUID = '';
                });
                $scope.$on('#Project.removed-ELEMENT', function (e, data) {
                    // 해당 element가 선택상태이면 선택 해지
                    __updateBoundary();
                });

                $scope.$on('#Project.modified-ELEMENT', function (e, data) {
                    // 해당 element가 선택상태이면 선택 해지
                    __updateBoundary();
                });

                $scope.$watch('selectInfo', function (newValue, oldValue) {

                    // snap 속성 업데이트
                    var scale = newValue ? newValue.scale : 1;
                    _snap.update('scale', scale);

                    __updateBoundary();

                }, true);

                /*
                 <div ng-class="{ 'wire': true, 'ui-draggable': draggable, 'ui-resizable': resizable, 'ui-rotatable': rotatable, 'ui-selected': selected }"
                 ng-attr-style="top: {{boundary.y}}px; left: {{boundary.x}}px; width: {{boundary.width}}px; height: {{boundary.height}}px;
                 background-color:rgba(255,255,0,0.5);">
                 */
                function __updateBoundary() {

                    //out('* UI CONTROL selectUID : ', $scope.selectInfo);
                    var info = $scope.selectInfo;
                    if (info === undefined || !info.uid) {
                        $scope.selected = false;
                        $scope.boundary = null;
                        return;
                    }

                    // 선택 변경 작업 중에는 transition 업앰
                    if (_notUseTransition) {
                        $scope.transition = false;
                    }

                    // 해당 문서의 Element DOM 찾기
                    var selectUID = info.uid;
                    var $select = getSelectTarget(selectUID);

                    // var $parent = $element.parent();
                    // var $contentContainer = $parent.find('#hi-contentContainer');
                    // var $select = (selectUID) ? $contentContainer.find('[uid=' + selectUID + ']') : null;
                    // out('$contentContainer : ', $contentContainer);

                    //-----------------------
                    // Boundary 표시
                    //-----------------------

                    // out('$select : ', $scope.rendered, $select);
                    if ($select == null || $select.length < 1) {
                        $scope.selected = false;
                        $scope.boundary = null;
                        return;
                    }

                    // 편집 UI를 구성한다.
                    var rect = {
                        x: U.toNumber($select.css('left')),
                        y: U.toNumber($select.css('top')),

                        width: $select.outerWidth(),
                        height: $select.outerHeight()
                    };
                    // rect = $scope.getBoundary({uid:selectUID});

                    // scale 적용
                    var scale = info.scale;
                    var boundary = {
                        elementUID: selectUID,
                        scale: scale,

                        width: (rect.width * scale),
                        height: (rect.height * scale),
                        x: (rect.x * scale),
                        y: (rect.y * scale)
                    }

                    $scope.boundary = boundary;
                    $scope.selected = true;
                    //out('boundary : ', boundary );

                    // transition 되돌림
                    if (_notUseTransition) {
                        var transitionTime = Tool.transition.TICK;
                        $timeout(function () {
                            _notUseTransition = false;
                            $scope.transition = true;
                        }, transitionTime);
                    }
                }

                ////////////////////////////////////////////////////////////////////////////////
                // 마우스 동작
                ////////////////////////////////////////////////////////////////////////////////

                // 제거
                $scope.$on("$destroy", function () {

                    // 마우스 이벤트 제거됨
                    $scope.selected = false;

                    _dragUtil = null;
                    _resizeUtil = null;
                    _snap = null;
                });

                //-----------------------------------
                // 선택 상태
                //-----------------------------------

                /*
                 function __updateSelected() {

                 }
                 */

                //-----------------------------------
                // 드래그 기능
                //-----------------------------------

                function __updateDraggable(usable) {
                    var eventOwner = $element.find('.ui-draggable-handle');
                    var dragTarget = $element;

                    clearDrag(eventOwner, dragTarget);
                    if (!usable) return;

                    setDrag(eventOwner, dragTarget);
                }

                //-----------------------------------
                // 리사이징 기능
                //-----------------------------------

                function __updateResizable(usable) {
                    var eventOwner = $element.find('.ui-resizable-handle');
                    var resizeTarget = $element;

                    clearResize(eventOwner, resizeTarget);
                    if (!usable) return;

                    setResize(eventOwner, resizeTarget);
                }

                //-----------------------------------
                // 회전 기능
                //-----------------------------------

                function __updateRotatable(usable) {
                    var eventOwner = $element.find('.ui-rotate-handle');
                    var rotateTarget = $element;

                    clearRotate(eventOwner, rotateTarget);
                    if (!usable) return;

                    setRotate(eventOwner, rotateTarget);
                }

                function toInt(num) {
                    return Math.round(num);
                    // return num;
                }

                ////////////////////////////////////////
                // 회전 동작
                ////////////////////////////////////////

                var _rotateUtil = new Rotator();

                function clearRotate(eventOwner, rotateTarget) {
                    if (!_rotateUtil) return;

                    _rotateUtil.removeEvent("Rotator.dragStart", _onRotateStart);
                    _rotateUtil.removeEvent("Rotator.dragEnd", _onRotateEnd);
                    _rotateUtil.removeEvent("Rotator.drag", _onRotate);
                    _rotateUtil.removeEvent("Rotator.clicked", _onClickRotate);
                    // _rotateUtil = null;
                }

                function setRotate(eventOwner, rotateTarget) {
                    clearRotate();

                    var initObj = {
                        //direction : "x", // x, y, both
                        // move 감도 지정
                        delay: 0,
                        // 회전 적용 대상
                        dragTarget: rotateTarget
                    };

                    // _rotateUtil = new Rotator();
                    _rotateUtil.initialize(eventOwner, initObj);

                    _rotateUtil.addEvent("Rotator.dragStart", _onRotateStart);
                    _rotateUtil.addEvent("Rotator.dragEnd", _onRotateEnd);
                    _rotateUtil.addEvent("Rotator.drag", _onRotate);
                    _rotateUtil.addEvent("Rotator.clicked", _onClickRotate);
                }

                //-----------------------------------
                // Rotate 리스너
                //-----------------------------------

                function _onRotateStart(e) {
                    //out("_onRotateStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function () {
                        $scope.transition = false;
                    });

                    rotateHandler(e);
                }

                function _onRotate(e) {
                    //out("_onRotate : ", e.x, e.y);
                    rotateHandler(e);
                }

                function rotateHandler(_dragEvent) {
                    if (!_dragEvent) return;

                    //-----------------
                    // Element 속성값 수정
                    //-----------------

                    var selectUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    var el = Project.current.getElement(documentUID, selectUID);
                    var $el = angular.element(el);

                    var x = toInt(_dragEvent.x);
                    var y = toInt(_dragEvent.y);

                    out("_onRotate : ", _dragEvent.deg);







                    //var w = $el.width();
                    //var h = $el.height();
                    //translate('+ w + 'px, ' + h + 'px)
                    $el.css('transform', 'rotate(' + _dragEvent.deg + 'deg)');

                    //_dragEvent.preventDefault();

                    //$el.css({
                    //    'left': x,
                    //    'top': y
                    //});
                    // __updateBoundary();
                }

                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onRotateEnd(e) {
                    //out("_onRotateEnd : ", e.x, e.y);
                    $scope.$apply(function () {
                        $scope.transition = true;
                    });

                    //-----------------
                    // Command 호출
                    //-----------------

                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();

                    var x = toInt(e.x);
                    var y = toInt(e.y);
                    var deg = toInt(e.deg);
                    out("_onRotate End : ", deg);

                    var param = {
                        // 삽입될 문서
                        documentUID: documentUID,
                        elementUID: elementUID,

                        // element 설정값
                        option: {},
                        css: {
                            //'left': x + 'px',
                            //'top': y + 'px'
                            'transform': deg
                        }
                    };
                    CommandService.exe(CommandService.MODIFY_ELEMENT, param, function () {
                        // initial 인 경우 사이즈 원래대로
                        $scope.$evalAsync(function () {
                            __updateBoundary();
                        });
                    });
                }

                function _onClickRotate(e) {
                    $scope.$apply(function () {
                        $scope.transition = true;
                    });
                    // out("_onClickDrag : ", e);
                }

                ////////////////////////////////////////
                // 드래그 동작
                ////////////////////////////////////////

                // http://stackoverflow.com/questions/17423328/jquery-handle-mouse-events-inside-iframe
                // http://78.110.163.229/angDnd/outer.html
                // http://css.dzone.com/articles/all-mouse-events-javascript

                var _snap = new Snap();
                var _dragUtil = new Drager();
                // var _loop = false;
                // var _dragEvent = null;

                function clearDrag(eventOwner, dragTarget) {
                    if (!_dragUtil) return;

                    _dragUtil.removeEvent("Drager.dragStart", _onDragStart);
                    _dragUtil.removeEvent("Drager.dragEnd", _onDragEnd);
                    _dragUtil.removeEvent("Drager.drag", _onDrag);
                    _dragUtil.removeEvent("Drager.clicked", _onClickDrag);
                    // _dragUtil = null;
                }

                function setDrag(eventOwner, dragTarget) {
                    clearDrag();

                    var initObj = {
                        //direction : "x", // x, y, both
                        dragLimitOption: 'none', // inner, center, outter, none
                        // 한계치 지정하지 않으려면 반드시 null을 설정한다.
                        minX: null,
                        minY: null,
                        maxX: null,
                        maxY: null,
                        // move 감도 지정
                        delay: 0,
                        swapIndex: false,
                        // 드래그 적용 대상
                        dragTarget: dragTarget,
                        snap: _snap
                    };

                    // _dragUtil = new Drager();
                    _dragUtil.initialize(eventOwner, initObj);

                    _dragUtil.addEvent("Drager.dragStart", _onDragStart);
                    _dragUtil.addEvent("Drager.dragEnd", _onDragEnd);
                    _dragUtil.addEvent("Drager.drag", _onDrag);
                    _dragUtil.addEvent("Drager.clicked", _onClickDrag);
                }

                //-----------------------------------
                // 드래그 리스너
                //-----------------------------------

                function _onDragStart(e) {
                    out("_onDragStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function () {
                        $scope.transition = false;
                    });

                    // _loop = true;
                    // _dragEvent = e;

                    /*
                     (function watchMoveLoop() {
                     if (!_loop) return;
                     dragHandler();
                     requestAnimationFrame(watchMoveLoop);
                     })();
                     */
                    dragHandler(e);
                }

                function _onDrag(e) {
                    out("_onDrag : ", e.x, e.y);
                    // e.preventDefault();
                    // _dragEvent = e;

                    dragHandler(e);
                }

                function dragHandler(_dragEvent) {
                    if (!_dragEvent) return;

                    //-----------------
                    // Element 속성값 수정
                    //-----------------

                    var scale = $scope.selectInfo.scale;
                    var selectUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    var el = Project.current.getElement(documentUID, selectUID);
                    var $el = angular.element(el);
                    // out("_onDrag : ", $el);

                    var x = toInt(_dragEvent.x * (1 / scale));
                    var y = toInt(_dragEvent.y * (1 / scale));

                    $el.css({
                        'left': x,
                        'top': y
                    });
                    // __updateBoundary();
                }

                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onDragEnd(e) {
                    out("_onDragEnd : ", e.x, e.y);
                    // _loop = false;
                    // _dragEvent = null;

                    $scope.$apply(function () {
                        $scope.transition = true;
                    });

                    //-----------------
                    // Command 호출
                    //-----------------

                    var scale = $scope.selectInfo.scale;
                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();

                    var x = toInt(e.x * (1 / scale));
                    var y = toInt(e.y * (1 / scale));

                    var param = {
                        // 삽입될 문서
                        documentUID: documentUID,
                        elementUID: elementUID,

                        // element 설정값
                        option: {},
                        css: {
                            'left': x + 'px',
                            'top': y + 'px'
                        }
                    };
                    CommandService.exe(CommandService.MODIFY_ELEMENT, param, function () {
                        // initial 인 경우 사이즈 원래대로
                        $scope.$evalAsync(function () {
                            __updateBoundary();
                        });
                    });
                }

                function _onClickDrag(e) {
                    $scope.$apply(function () {
                        $scope.transition = true;
                    });
                    // out("_onClickDrag : ", e);
                }

                ////////////////////////////////////////
                // 리사이징 동작
                ////////////////////////////////////////

                var _resizeUtil = new Resizer();
                // var _resizeEvent = null;

                function clearResize(eventOwner, resizeTarget) {
                    if (!_resizeUtil) return;
                    _resizeUtil.removeEvent("Resizer.resizeStart", _onResizeStart);
                    _resizeUtil.removeEvent("Resizer.resizeEnd", _onResizeEnd);
                    _resizeUtil.removeEvent("Resizer.resize", _onResize);
                    _resizeUtil.removeEvent("Resizer.clicked", _onClickResize);
                    // _resizeUtil = null;
                }

                function getSelectTarget(elementUID) {
                    var content = $scope.item.content;
                    var $content = angular.element(content);
                    var proxyTarget = (elementUID) ? $content.find('[uid=' + elementUID + ']') : null;
                    return proxyTarget;
                }

                function setResize(eventOwner, resizeTarget) {
                    clearResize();

                    var initObj = {
                        dragLimitOption: false, // true, false(=default)
                        // 한계치 지정하지 않으려면 반드시 null을 설정한다.
                        minX: null,
                        minY: null,
                        maxX: null,
                        maxY: null,
                        // move 감도 지정
                        delay: 0,
                        swapIndex: true,
                        // 드래그 적용 대상
                        resizeTarget: resizeTarget,
                        proxyTarget: getSelectTarget($scope.selectInfo.uid),
                        snap: _snap
                    };

                    // _resizeUtil = new Resizer();
                    _resizeUtil.initialize(eventOwner, initObj);

                    _resizeUtil.addEvent("Resizer.resizeStart", _onResizeStart);
                    _resizeUtil.addEvent("Resizer.resizeEnd", _onResizeEnd);
                    _resizeUtil.addEvent("Resizer.resize", _onResize);
                    _resizeUtil.addEvent("Resizer.clicked", _onClickResize);
                }

                //-----------------------------------
                // 리사이즈 리스너
                //-----------------------------------

                // 취소 작업시 필요한 초기 좌표를 기억한다
                // var _originalX = 0;
                // var _originalY = 0;

                function _onResizeStart(e) {
                    // out("_onResizeStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function () {
                        $scope.transition = false;
                    });

                    var $anchor = angular.element(e.target);
                    var direction;
                    if ($anchor.hasClass('ui-resizable-n')) {
                        direction = "n";
                    } else if ($anchor.hasClass('ui-resizable-e')) {
                        direction = "e";
                    } else if ($anchor.hasClass('ui-resizable-s')) {
                        direction = "s";
                    } else if ($anchor.hasClass('ui-resizable-w')) {
                        direction = "w";
                    } else if ($anchor.hasClass('ui-resizable-se')) {
                        direction = "se";
                    } else if ($anchor.hasClass('ui-resizable-sw')) {
                        direction = "sw";
                    } else if ($anchor.hasClass('ui-resizable-ne')) {
                        direction = "ne";
                    } else if ($anchor.hasClass('ui-resizable-nw')) {
                        direction = "nw";
                    }

                    _resizeUtil.direction = direction;

                    // _loop = true;
                    // _resizeEvent = e;

                    /*
                     // 초기 좌표 기억
                     // var elementUID = $scope.selectInfo.uid;
                     // var documentUID = Project.current.getSelectDocument();
                     // var el = Project.current.getElement(documentUID, elementUID);
                     // var $el = angular.element(el);

                     // _originalX = toInt (U.toNumber($el.css("left")));
                     // _originalY = toInt (U.toNumber($el.css("top")));

                     // 랜더링 루프
                     (function watchMoveLoop() {
                     if (!_loop) return;
                     resizeHandler();
                     requestAnimationFrame(watchMoveLoop);
                     })();
                     */

                    resizeHandler(e);
                }

                function _onResize(e) {
                    // out("_onResize : ", e.x, e.y, e.width, e.height, e.distX, e.distY);
                    // e.preventDefault();
                    // _resizeEvent = e;

                    resizeHandler(e);

                    //*********************
                    // 여기에서 값 초기화 해 주어야 up상태가 됬을때 boundary에의해 UI가 다시 갱신된다.
                    // 이전 값과 같은 상태이면 angular는 DOM을 update 시키지 않기 때문임
                    $scope.boundary = null;
                    //*********************
                }

                function resizeHandler(_resizeEvent) {
                    if (!_resizeEvent) return;
                    // out('_resizeEvent : ', _resizeEvent);

                    //-----------------
                    // Element 속성값 수정
                    //-----------------

                    var scale = $scope.selectInfo.scale;
                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    var el = Project.current.getElement(documentUID, elementUID);
                    var $el = angular.element(el);
                    // out("_onDrag : ", $el);

                    var x = toInt(_resizeEvent.x * (1 / scale));
                    var y = toInt(_resizeEvent.y * (1 / scale));
                    var w = toInt(_resizeEvent.width * (1 / scale));
                    var h = toInt(_resizeEvent.height * (1 / scale));

                    var css;
                    /*
                     if($scope.display_size_toText){
                     css = {
                     'left': x,
                     'top': y,
                     'width': w,
                     'height': h
                     // 'word-wrap': 'break-word'
                     };
                     }else{
                     css = {
                     'left': x,
                     'top': y,
                     'width': w,
                     'height': h
                     // 'word-wrap': 'inherit'
                     };
                     }
                     */
                    var border = U.toNumber($el.css('borderWidth'));
                    var minW = U.toNumber($el.css('paddingLeft')) + U.toNumber($el.css('paddingRight')) + border * 2;
                    var minH = U.toNumber($el.css('paddingTop')) + U.toNumber($el.css('paddingBottom')) + border * 2;
                    css = {
                        'left': x + 'px',
                        'top': y + 'px',
                        //'min-width': minW + 'px',
                        //'min-height': minH + 'px',
                        'width': Math.max(w, minW) + 'px',
                        'height': Math.max(h, minH) + 'px'
                    };

                    $el.css(css);
                    __updateBoundary();
                }

                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onResizeEnd(e) {
                    // out("_onResizeEnd : ", e);
                    // _loop = false;
                    // _resizeEvent = null;

                    $scope.$apply(function () {
                        $scope.transition = true;
                    });

                    //-----------------
                    // Command 호출
                    //-----------------

                    var scale = $scope.selectInfo.scale;
                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();

                    var x = toInt(e.x * (1 / scale));
                    var y = toInt(e.y * (1 / scale));
                    var w = toInt(e.width * (1 / scale));
                    var h = toInt(e.height * (1 / scale));

                    var css;
                    /*
                     if($scope.display_size_toText) {
                     // text box 최대 너비값 구하기
                     var el = Project.current.getElement(documentUID, elementUID);
                     var $el = angular.element(el);
                     $el.css({
                     'width': 'initial'
                     // 'word-wrap': 'initial'
                     });
                     var maxW = toInt ($el.width()+1);
                     var wordWrap;
                     if(maxW <= w){
                     // wordWrap = 'initial';
                     w = maxW;
                     }else{
                     // wordWrap = 'break-word';
                     }

                     // text box에 크기 맞춤
                     css = {
                     'left': x + 'px',
                     'top': y + 'px',
                     'width': w + 'px',
                     'height': 'initial'
                     // 'word-wrap': wordWrap
                     };
                     }else{
                     // 사용자 지정 크기에 text 크기 맞춤
                     css = {
                     'left': x + 'px',
                     'top': y + 'px',
                     'width': w + 'px',
                     'height': h + 'px'
                     // 'word-wrap': 'initial'
                     };
                     }
                     */

                    var el = Project.current.getElement(documentUID, elementUID);
                    var $el = angular.element(el);
                    var border = U.toNumber($el.css('borderWidth'));
                    var minW = U.toNumber($el.css('paddingLeft')) + U.toNumber($el.css('paddingRight')) + border * 2;
                    var minH = U.toNumber($el.css('paddingTop')) + U.toNumber($el.css('paddingBottom')) + border * 2;
                    css = {
                        'left': x + 'px',
                        'top': y + 'px',
                        //'min-width': minW + 'px',
                        //'min-height': minH + 'px',
                        'width': Math.max(w, minW) + 'px',
                        'height': Math.max(h, minH) + 'px'
                    };

                    var param = {
                        // 삽입될 문서
                        documentUID: documentUID,
                        elementUID: elementUID,

                        // element 설정값
                        option: {},
                        css: css
                    };
                    CommandService.exe(CommandService.MODIFY_ELEMENT, param, function () {
                        // initial 인 경우 사이즈 원래대로
                        //if($scope.display_size_toText) {
                        $scope.$evalAsync(function () {
                            __updateBoundary();
                        });
                        //}
                    });
                }

                function _onClickResize(e) {
                    $scope.$apply(function () {
                        $scope.transition = true;
                    });
                    out("_onClickResize : ", e);
                }

                ////////////////////////////////////////////////////////////////////////////////
                //
                // 편집
                //
                ////////////////////////////////////////////////////////////////////////////////

                // 현재 Element가 편집 사태인지 여부
                $scope.editableUID = '';

                $scope.$watch('editableUID', function (newValue, oldValue) {
                    if (newValue == oldValue) return;
                    $scope._checkEditable(newValue, oldValue);
                });

                $scope._checkEditable = function (newElementUID, oldElementUID, callCommand) {
                    var documentUID = Project.current.getSelectDocument();
                    var directiveName = 'element';

                    if (oldElementUID) {
                        out('* 편집 해지 : ', oldElementUID);
                        var selector = '#hi-contentContainer [uid=' + oldElementUID + ']';
                        var scope = $getScope(selector, directiveName);
                        scope.deactivateEdit(documentUID, oldElementUID);

                        // 수정 Command 호출
                        if (callCommand === undefined || callCommand) {
                            out('* Element 수정 내용 적용 : modify Command 호출');
                            var param = Project.current.getModifyElementParameter(documentUID, oldElementUID);
                            CommandService.exe(CommandService.MODIFY_ELEMENT, param);
                        }
                    }

                    if (newElementUID) {
                        out('* 편집 모드 : ', newElementUID);
                        var selector = '#hi-contentContainer [uid=' + newElementUID + ']';
                        var scope = $getScope(selector, directiveName);
                        scope.activateEdit(documentUID, newElementUID);
                    }
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

            function Link($scope, $element, $attrs, controller) {

                // $timeout (function() {
                //     $element.trigger('#view.layoutUpdate');
                // }, 100);

                //-----------------------
                // 메뉴 클릭 이벤트 처리
                //-----------------------

                // 메뉴 항목을 클릭한 경우 호출되는 함수
                $scope.callAPI = function () {

                    var arg = U.toArray(arguments);
                    var funcName = arg.shift();
                    out(' * callAPI : ', funcName);

                    if (funcName) {
                        eval(funcName).apply(null, arg);
                    }

                };

                // element 삭제
                function remove() {
                    var documentUID = Project.current.getSelectDocument();
                    var elementUID = Project.current.getSelectElement(documentUID);
                    var param = {
                        documentUID: documentUID,
                        elementUID: elementUID
                    }
                    CommandService.exe(CommandService.REMOVE_ELEMENT, param);
                }

                //-----------------------
                // 편집 모드
                //-----------------------

                function edit() {
                    /*
                     if($scope.editableUID){
                     $scope.editableUID = '';
                     return;
                     }
                     */

                    var elementUID = Project.current.getSelectElement();
                    $scope.editableUID = elementUID;
                }

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        _directive._regist = function (application) {
            // 모듈에 정의
            // var _module = angular.module('uiModule', ['ngCollection']);

            // _module.service('UIService', _service);

            // 등록
            // _module.directive( 'uid', uid );
            // _module.directive( 'uiCanvas', uiCanvas );
            // _module.directive( 'uiControl', uiControl );
            application.directive('uiControl', _directive);

            // _module.directive( 'uiSelected', uiSelected );
            // _module.directive( 'uiDraggable', uiDraggable );
            // _module.directive( 'uiResizable', uiResizable );
            // _module.directive( 'uiRotatable', uiResizable );
        };
        return _directive;
    }
);






