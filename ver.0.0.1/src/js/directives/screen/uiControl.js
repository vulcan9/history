/*////////////////////////////////////////////////////////////////////////////////

    * 
    * Developer : (c) Dong-il Park (pdi1066@naver.com)
    * Project : HI-STORY (https://github.com/vulcan9/history)
    * Description : UI 컨트롤을 위한 기능 구현

////////////////////////////////////////////////////////////////////////////////*/

'use strict';

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 모듈에 정의
        // var _module = angular.module('uiModule', ['ngCollection']);

        // _module.service('UIService', _service);

        // 등록
        // _module.directive( 'uid', uid );
        // _module.directive( 'uiCanvas', uiCanvas );
        // _module.directive( 'uiControl', uiControl );
        application.directive( 'uiControl', _directive );

        // _module.directive( 'uiSelected', uiSelected );
        // _module.directive( 'uiDraggable', uiDraggable );
        // _module.directive( 'uiResizable', uiResizable );
        // _module.directive( 'uiRotatable', uiResizable );

        // 선언
        function _directive(Drager, Resizer, Snap, CommandService, Project, Tool, $timeout) {

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
            
            function Controller( $scope, $element, $attrs, VersionService) {
                
                ////////////////////////////////////////
                // 환경 설정값
                ////////////////////////////////////////
                
                //-------------------
                // 텍스트 크기 맞춤 옵션
                //-------------------

                $scope.$on('#Project.changed-element.option.display_size_toText' , function(e, data){
                    $scope.display_size_toText = data.newValue;
                });

                //-------------------
                // snap 크기
                //-------------------

                $scope.$watch('display_snap_pixel',  function (newValue, oldValue){
                    Tool.current.config_display('display_snap_pixel', newValue);
                });

                $scope.$on('#Tool.changed-CONFIG.display.display_snap_pixel' , function(e, data){
                    $scope.display_snap_pixel = data.newValue;
                });

                //-------------------
                // snap 크기
                //-------------------

                $scope.$watch('display_snap_pixel',  function (newValue, oldValue){
                    // snap 속성 업데이트
                    var sensitive = (newValue || newValue > 1) ? newValue : 1;
                    _snap.update('sensitive', sensitive);
                });

                $scope.$on('#Tool.changed-CONFIG.display.display_snap_pixel' , function(e, data){
                    $scope.display_snap_pixel = data.newValue;
                });

                function _setElementOption(){
                    
                    // Tool 지정값
                    $scope.display_snap_pixel = Tool.current.config_display('display_snap_pixel');

                    // 개별 지정 옵션
                    var api = Project.current.elementAPI ();
                    $scope.display_size_toText = api.option('display_size_toText');
                }

                ////////////////////////////////////////
                // 기능 설정
                ////////////////////////////////////////
                
                var self = this;
                $scope.transition = true;
                $scope.selected = false;

                $scope.$watch('selected',  function (newValue, oldValue){
                    //**************************

                    $scope.draggable = newValue;
                    $scope.resizable = newValue;
                    $scope.rotatable = newValue;

                    //**************************
                    
                    if(!newValue) return;

                    // 설정값 갱신
                    _setElementOption();
                });

                $scope.$watch('draggable',  function (newValue, oldValue){
                    __updateDraggable(newValue);
                });

                $scope.$watch('resizable',  function (newValue, oldValue){
                    __updateResizable(newValue);
                });

                $scope.$watch('rotatable',  function (newValue, oldValue){
                    __updateRotatable(newValue);
                });

                ////////////////////////////////////////
                // 선택 상태 표시 업데이트
                ////////////////////////////////////////
                
                // 선택 변경 작업 중에는 transition 없앰
                var _notUseTransition = false;

                $scope.$on('#Project.selected-ELEMENT', function(e, data){
                    _notUseTransition = true;
                });
                
                $scope.$watch('selectInfo',  function (newValue, oldValue){

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
                function __updateBoundary(){

                    out('* UI CONTROL selectUID : ', $scope.selectInfo);
                    var info = $scope.selectInfo;
                    if(info === undefined || !info.uid){
                        $scope.selected = false;
                        $scope.boundary = null;
                        return;
                    }

                    // 선택 변경 작업 중에는 transition 업앰
                    if(_notUseTransition){
                        $scope.transition = false;
                    }

                    var selectUID = info.uid;

                    // 해당 문서의 Element DOM 찾기
                    // var content = $scope.$parent.item.content;
                    var content = $scope.item.content;
                    var $content = angular.element(content);
                    var $select = (selectUID) ? $content.find('[uid=' + selectUID + ']') : null;

                    // var $parent = $element.parent();
                    // var $contentContainer = $parent.find('#contentContainer');
                    // var $select = (selectUID) ? $contentContainer.find('[uid=' + selectUID + ']') : null;
                    // out('$contentContainer : ', $contentContainer);

                    //-----------------------
                    // Boundary 표시
                    //-----------------------
                    
                    // out('$select : ', $scope.rendered, $select);
                    if($select == null || $select.length < 1){
                        $scope.selected = false;
                        $scope.boundary = null;
                        return;
                    }

                    // // 편집 UI를 구성한다.
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

                        width:  (rect.width * scale),
                        height:  (rect.height * scale),
                        x:  (rect.x * scale),
                        y:  (rect.y * scale)
                        // width: rect.width * scale,
                        // height: rect.height * scale,
                        // x: rect.x * scale,
                        // y: rect.y * scale
                    }

                    $scope.boundary = boundary;
                    $scope.selected = true;

                    // transition 되돌림
                    if(_notUseTransition){
                        var transitionTime = Tool.current.tool('CONFIG').transition.TICK;
                        $timeout(function (){
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
                    if(!usable) return;

                    setDrag(eventOwner, dragTarget);
                }

                //-----------------------------------
                // 리사이징 기능
                //-----------------------------------
                
                function __updateResizable(usable) {
                    var eventOwner = $element.find('.ui-resizable-handle');
                    var resizeTarget = $element;

                    clearResize(eventOwner, resizeTarget);
                    if(!usable) return;

                    setResize(eventOwner, resizeTarget);
                }

                //-----------------------------------
                // 회전 기능
                //-----------------------------------
                
                function __updateRotatable(usable) {
                    out('TODO : 구현 안됨 (uiControl rotate)');
                }

                function toInt (num){
                    return Math.round(num);
                    // return num;
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

                function clearDrag(eventOwner, dragTarget){
                    if(!_dragUtil) return;
                    
                    _dragUtil.removeEvent("Drager.dragStart", _onDragStart );
                    _dragUtil.removeEvent("Drager.dragEnd", _onDragEnd );
                    _dragUtil.removeEvent("Drager.drag", _onDrag );
                    _dragUtil.removeEvent("Drager.clicked", _onClickDrag );
                    // _dragUtil = null;
                }
                
                function setDrag(eventOwner, dragTarget){
                    clearDrag();

                    var initObj = {
                        //direction : "x", // x, y, both
                        dragLimitOption : "inner", // inner, center, outter, none
                        // 한계치 지정하지 않으려면 반드시 null을 설정한다.
                        minX : null,
                        minY : null,
                        maxX : null,
                        maxY : null,
                        // move 감도 지정
                        delay : 0,
                        swapIndex: false,
                        // 드래그 적용 대상
                        dragTarget: dragTarget,
                        snap : _snap
                    };

                    // _dragUtil = new Drager();
                    _dragUtil.initialize(eventOwner, initObj);
                    
                    _dragUtil.addEvent("Drager.dragStart", _onDragStart );
                    _dragUtil.addEvent("Drager.dragEnd", _onDragEnd );
                    _dragUtil.addEvent("Drager.drag", _onDrag );
                    _dragUtil.addEvent("Drager.clicked", _onClickDrag );
                }

                //-----------------------------------
                // 드래그 리스너
                //-----------------------------------

                function _onDragStart(e){
                    // out("_onDragStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function (){
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

                function _onDrag(e){
                    // out("_onDrag : ", e.x, e.y);
                    // e.preventDefault();
                    // _dragEvent = e;

                    dragHandler(e);
                }

                function dragHandler(_dragEvent){
                    if(!_dragEvent) return;

                    //-----------------
                    // Element 속성값 수정
                    //-----------------
                    
                    var scale = $scope.selectInfo.scale;
                    var selectUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    var el = Project.current.getElement(documentUID, selectUID);
                    var $el = angular.element(el);
                    // out("_onDrag : ", $el);
                    
                    var x = toInt (_dragEvent.x * (1/scale));
                    var y = toInt (_dragEvent.y * (1/scale));

                    $el.css({
                        'left': x,
                        'top': y
                    });
                    // __updateBoundary();
                }

                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onDragEnd(e){
                    // out("_onDragEnd : ", e.x, e.y);
                    // _loop = false;
                    // _dragEvent = null;

                    $scope.$apply(function (){
                        $scope.transition = true;
                    });

                    //-----------------
                    // Command 호출
                    //-----------------

                    var scale = $scope.selectInfo.scale;
                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    
                    var x = toInt (e.x * (1/scale));
                    var y = toInt (e.y * (1/scale));

                    var param = {
                        // 삽입될 문서
                        documentUID : documentUID,
                        elementUID: elementUID,

                        // element 설정값
                        option: {},
                        css: {
                            'left': x,
                            'top': y
                        }
                    };
                    CommandService.exe(CommandService.MODIFY_ELEMENT, param, function(){
                        // initial 인 경우 사이즈 원래대로
                            $scope.$evalAsync(function(){
                                __updateBoundary();
                            });
                    });
                }

                function _onClickDrag(e){
                    $scope.$apply(function (){
                        $scope.transition = true;
                    });
                    // out("_onClickDrag : ", e);
                }

                ////////////////////////////////////////
                // 리사이징 동작
                ////////////////////////////////////////

                var _resizeUtil = new Resizer();
                // var _resizeEvent = null;

                function clearResize(eventOwner, resizeTarget){
                    if(!_resizeUtil) return;
                    _resizeUtil.removeEvent("Resizer.resizeStart", _onResizeStart );
                    _resizeUtil.removeEvent("Resizer.resizeEnd", _onResizeEnd );
                    _resizeUtil.removeEvent("Resizer.resize", _onResize );
                    _resizeUtil.removeEvent("Resizer.clicked", _onClickResize );
                    // _resizeUtil = null;
                }
                
                function setResize(eventOwner, resizeTarget){
                    clearResize();

                    var initObj = {
                        dragLimitOption : true, // true, false(=default)
                        // 한계치 지정하지 않으려면 반드시 null을 설정한다.
                        minX : null,
                        minY : null,
                        maxX : null,
                        maxY : null,
                        // move 감도 지정
                        delay : 0,
                        swapIndex: true,
                        // 드래그 적용 대상
                        resizeTarget: resizeTarget,
                        snap : _snap
                    };

                    // _resizeUtil = new Resizer();
                    _resizeUtil.initialize(eventOwner, initObj);
                    
                    _resizeUtil.addEvent("Resizer.resizeStart", _onResizeStart );
                    _resizeUtil.addEvent("Resizer.resizeEnd", _onResizeEnd );
                    _resizeUtil.addEvent("Resizer.resize", _onResize );
                    _resizeUtil.addEvent("Resizer.clicked", _onClickResize );
                }

                //-----------------------------------
                // 리사이즈 리스너
                //-----------------------------------

                // 취소 작업시 필요한 초기 좌표를 기억한다
                // var _originalX = 0;
                // var _originalY = 0;

                function _onResizeStart(e){
                    // out("_onResizeStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function (){
                        $scope.transition = false;
                    });

                    var $anchor = angular.element(e.target);
                    var direction;
                    if ($anchor.hasClass('ui-resizable-n')){
                        direction = "n";
                    }else if($anchor.hasClass('ui-resizable-e')){
                        direction = "e";
                    }else if($anchor.hasClass('ui-resizable-s')){
                        direction = "s";
                    }else if($anchor.hasClass('ui-resizable-w')){
                        direction = "w";
                    }else if($anchor.hasClass('ui-resizable-se')){
                        direction = "se";
                    }else if($anchor.hasClass('ui-resizable-sw')){
                        direction = "sw";
                    }else if($anchor.hasClass('ui-resizable-ne')){
                        direction = "ne";
                    }else if($anchor.hasClass('ui-resizable-nw')){
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

                function _onResize(e){
                    // out("_onResize : ", e.x, e.y, e.width, e.height, e.distX, e.distY);
                    // e.preventDefault();
                    // _resizeEvent = e;

                    resizeHandler(e);
                }

                function resizeHandler(_resizeEvent){
                    if(!_resizeEvent) return;
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
                    
                    var x = toInt (_resizeEvent.x * (1/scale));
                    var y = toInt (_resizeEvent.y * (1/scale));
                    var w = toInt (_resizeEvent.width * (1/scale));
                    var h = toInt (_resizeEvent.height * (1/scale));
                    
                    var css;
                    if($scope.display_size_toText){
                        css = {
                            'left': x,
                            'top': y,
                            'width': w,
                            'height': h,
                            'word-wrap': 'break-word'
                        };
                    }else{
                        css = {
                            'left': x,
                            'top': y,
                            'width': w,
                            'height': h,
                            'word-wrap': 'inherit'
                        };
                    }

                    $el.css(css);
                    __updateBoundary();
                }

                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onResizeEnd(e){
                    // out("_onResizeEnd : ", e);
                    // _loop = false;
                    // _resizeEvent = null;

                    $scope.$apply(function (){
                        $scope.transition = true;
                    });

                    //-----------------
                    // Command 호출
                    //-----------------
                    
                    var scale = $scope.selectInfo.scale;
                    var elementUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();

                    var x = toInt (e.x * (1/scale));
                    var y = toInt (e.y * (1/scale));
                    var w = toInt (e.width * (1/scale));
                    var h = toInt (e.height * (1/scale));

                    var css;
                    if($scope.display_size_toText) {
                        // text box 최대 너비값 구하기
                        var el = Project.current.getElement(documentUID, elementUID);
                        var $el = angular.element(el);
                        $el.css({
                            'width': 'initial',
                            'word-wrap': 'inherit'
                        });
                        var maxW = toInt ($el.width());
                        var wordWrap;
                        if(maxW <= w){
                            wordWrap = 'inherit';
                            w = maxW;
                        }else{
                            wordWrap = 'break-word';
                        }

                        // text box에 크기 맞춤
                        css = {
                            'left': x,
                            'top': y,
                            'width': w,
                            'height': 'initial',
                            'word-wrap': wordWrap
                        };
                    }else{
                        // 사용자 지정 크기에 text 크기 맞춤
                        css = {
                            'left': x,
                            'top': y,
                            'width': w,
                            'height': h,
                            'word-wrap': 'inherit'
                        };
                    }

                    var param = {
                        // 삽입될 문서
                        documentUID : documentUID,
                        elementUID: elementUID,

                        // element 설정값
                        option: {},
                        css: css
                    };
                    CommandService.exe(CommandService.MODIFY_ELEMENT, param, function(){
                        // initial 인 경우 사이즈 원래대로
                        if($scope.display_size_toText) {
                            $scope.$evalAsync(function(){
                                __updateBoundary();
                            });
                        }
                    });
                }

                function _onClickResize(e){
                    $scope.$apply(function (){
                        $scope.transition = true;
                    });
                    out("_onClickResize : ", e);
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
            
            function Link ( $scope, $element, $attrs) {

                // $timeout (function() {
                //     $element.trigger('#view.layoutUpdate');
                // }, 100);

                ////////////////////////////////////////
                // End Link
                ////////////////////////////////////////
            }

            // end directive
        }

        // 리턴
        return _directive;
    }
);







