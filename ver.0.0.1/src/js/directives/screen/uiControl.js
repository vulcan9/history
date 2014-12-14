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
        function _directive(Drager) {

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
            
            function Controller( $scope, $element, $attrs, VersionService, $document) {
                
                var self = this;
                $scope.transition = true;
                $scope.selected = false;

                $scope.$watch('selected',  function (newValue, oldValue){
                    //**************************

                    $scope.draggable = newValue;
                    $scope.resizable = newValue;
                    $scope.rotatable = newValue;

                    //**************************
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
                
                $scope.$watch('selectInfo',  function (newValue, oldValue){
                    __updateBoundary(newValue);
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
                    var boundary = {
                        x: U.toNumber($select.css('left')),
                        y: U.toNumber($select.css('top')),
                        
                        width: $select.outerWidth(),
                        height: $select.outerHeight()
                    };
                    // boundary = $scope.getBoundary({uid:selectUID});

                    // scale 적용
                    var scale = info.scale;
                    var boundary = {
                        elementUID: selectUID,
                        scale: scale,

                        width: Math.ceil(boundary.width * scale),
                        height: Math.ceil(boundary.height * scale),
                        x: Math.ceil(boundary.x * scale),
                        y: Math.ceil(boundary.y * scale)
                        // width: boundary.width * scale,
                        // height: boundary.height * scale,
                        // x: boundary.x * scale,
                        // y: boundary.y * scale
                    }

                    $scope.boundary = boundary;
                    $scope.selected = true;
                }

                ////////////////////////////////////////////////////////////////////////////////
                // 마우스 동작
                ////////////////////////////////////////////////////////////////////////////////

                // 제거
                $scope.$on("$destroy", function () {
                    $scope.selected = false;

                    // 마우스 이벤트 제거할것
                    _dragUtil = null;
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

                }

                //-----------------------------------
                // 회전 기능
                //-----------------------------------
                
                function __updateRotatable(usable) {

                }

                ////////////////////////////////////////
                // 드래그 동작
                ////////////////////////////////////////

                // http://stackoverflow.com/questions/17423328/jquery-handle-mouse-events-inside-iframe
                // http://78.110.163.229/angDnd/outer.html
                // http://css.dzone.com/articles/all-mouse-events-javascript

                var _dragUtil = new Drager();

                function clearDrag(eventOwner, dragTarget){
                    if(!_dragUtil) return;
                    _dragUtil.removeEvent("dragStart", _onDragStart );
                    _dragUtil.removeEvent("dragEnd", _onDragEnd );
                    _dragUtil.removeEvent("drag", _onDrag );
                    _dragUtil.removeEvent("clicked", _onClick );
                    // _dragUtil = null;
                }
                
                function setDrag(eventOwner, dragTarget){
                    clearDrag();
                    // var $iframe = $scope.getContentContainer ();
                    // $iframe.css('pointer-events', 'none');

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
                        dragTarget: dragTarget
                    };

                    // var $splitBar = this.$el.find("#splitBar");
                    // $splitBar.css({"cursor":"e-resize"});
                    
                    // _dragUtil = new Drager();
                    _dragUtil.initialize(eventOwner, initObj);
                    
                    _dragUtil.addEvent("dragStart", _onDragStart );
                    _dragUtil.addEvent("dragEnd", _onDragEnd );
                    _dragUtil.addEvent("drag", _onDrag );
                    _dragUtil.addEvent("clicked", _onClick );

                    // var $iframe = $scope.getContentContainer ();
                    // angular.element($iframe[0].contentDocument).find(".body").on("mouseup", function() { alert("Hello"); });
                }

                function _onDragStart(e){
                    out("_onDragStart : ", e.distX, e.distY);
                    // transition이 적용되어 있으면 drag가 정상적으로 업데이트 되지 않는다.
                    $scope.$apply(function (){
                        $scope.transition = false;
                    });
                }

                function _onDrag(e){
                    out("_onDrag : ", e.distX, e.distY);
                    // e.preventDefault();

                    // Element 속성값 수정
                    var scale = $scope.selectInfo.scale;
                    var selectUID = $scope.selectInfo.uid;
                    var documentUID = Project.current.getSelectDocument();
                    var el = Project.current.getElement(documentUID, selectUID);
                    var $el = angular.element(el);
                    out("_onDrag : ", $el);

                    $el.css({
                        'left': e.x * (1/scale),
                        'top': e.y * (1/scale)
                    });






// Command 호출
// Property창 내용 구성
// 리사이징 기능 구현















                }
                
                // 앵커 드래그(위치변경)로 인한 데이터 갱신
                function _onDragEnd(e){
                    $scope.$apply(function (){
                        $scope.transition = true;
                    });
                    out("_onDragEnd : ", e.distX, e.distY);
                }

                function _onClick(e){
                    $scope.$apply(function (){
                        $scope.transition = true;
                    });
                    out("_onClick : ", e);
                }
/*
<div ng-class="{ 'wire': true, 'ui-draggable': draggable, 'ui-resizable': resizable, 'ui-rotatable': rotatable, 'ui-selected': selected }" 
    ng-attr-style="top: {{boundary.y}}px; left: {{boundary.x}}px; width: {{boundary.width}}px; height: {{boundary.height}}px; 
    background-color:rgba(255,255,0,0.5);">

    <!-- class="wire ui-draggable ui-resizable ui-rotatable ui-selected" 
    style="top: 0px; left: 0px; width: 240px; height: 160px; 
        background-color:rgba(255,255,0,0.5);">
     -->
    <!--선택 표시-->
    <div class="ui-resizable-handle ui-resizable-n"></div>
    <div class="ui-resizable-handle ui-resizable-e"></div>
    <div class="ui-resizable-handle ui-resizable-s"></div>
    <div class="ui-resizable-handle ui-resizable-w"></div>
    <div class="ui-resizable-handle ui-resizable-se"></div>
    <div class="ui-resizable-handle ui-resizable-sw"></div>
    <div class="ui-resizable-handle ui-resizable-ne"></div>
    <div class="ui-resizable-handle ui-resizable-nw"></div>

    <div class="ui-rotate-handle"></div>
</div>

                    element.bind('mousedown', function (event) {
                        // Prevent default dragging of selected content
                        console.log("binding element to move.");
                        startX = event.screenX - x;
                        startY = event.screenY - y;
                        $document.bind('mousemove', moveDiv);
                        $document.bind('mouseup', mouseup);
                    });


    PopupClass.prototype._setDrag = function(){
        if(this._movable == false) return;
        
        // 드래그 대상
        var $_dragTarget = (this._modal)? this.$_instance.find(".content"):this.$_instance;
        
        // 위치 이동 저장
        var _tempX = 0;
        var _tempY = 0;
        
        var mouseUtil = {
            minX:0,
            minY:0,
            maxX:0,
            maxY:0,
            _onMouseDown : function (event){
                _tempX = event.pageX;
                _tempY = event.pageY;
                
                var target = $(document);
                target.on("mousemove", angular.bind( this, Util._onMouseMove, this));
                target.on("mouseup", angular.bind( this, Util._onMouseUp, this));
                
                var offset = $_dragTarget.offset();
                
                // position:fixed 일때 스크롤 위치에 영향받음
                if(this.$_instance.css("position") =="fixed"){
                    offset.left = offset.left - this.$_popupOwner.scrollLeft();
                    offset.top = offset.top - this.$_popupOwner.scrollTop();
                }
                $_dragTarget.css("left", offset.left);
                $_dragTarget.css("top", offset.top);
                
                // margin의 영향을 없앰
                $_dragTarget.css("margin", "0px");
                
                // 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
                this.setTopIndex();

                // 드래그 범위 지정
                mouseUtil._setLimit();
                
                // prevents text selection
                return false;
            },
            _onMouseMove : function (event){
                
                var offset = $_dragTarget.offset();
                var x = offset.left;
                var y = offset.top;
                
                // 이동 거리
                x += event.pageX - _tempX;
                y += event.pageY - _tempY;
                
                // 한계 설정
                var limit = mouseUtil._checkLimit(x,y);
                x = limit.x;
                y = limit.y;
                
                // 위치 갱신
                $_dragTarget.css("left", x);
                $_dragTarget.css("top", y);
                
                _tempX = event.pageX;
                _tempY = event.pageY;
            },
            _onMouseUp : function (event){
                var target = $(event.currentTarget);
                target.off("mousemove", angular.bind( this, Util._onMouseMove, this));
                target.off("mouseup", angular.bind( this, Util._onMouseUp, this));
                
                // 이벤트 발송
                //this.dispatchChangeEvent();
            },
            
            // 드래그 허용 범위 설정
            _setLimit : function(){
                var offsetX = $_dragTarget.width()/2;
                var offsetY = $_dragTarget.height()/2;
                
                mouseUtil.minX = -offsetX;
                mouseUtil.minY = 0;
                mouseUtil.maxX = window.innerWidth - offsetX;
                mouseUtil.maxY = window.innerHeight - offsetY;
            },
            // 드래그 허용 범위내의 값으로 변환
            _checkLimit : function(x,y){
                //console.log(x,y,mouseUtil.minX, mouseUtil.minY);
                if(mouseUtil.minX > x) x = mouseUtil.minX;
                if(mouseUtil.maxX < x) x = mouseUtil.maxX;
                
                if(mouseUtil.minY > y) y = mouseUtil.minY;
                if(mouseUtil.maxY < y) y = mouseUtil.maxY;
                
                return {x:x, y:y};
            }
        };

        // 드래그 버튼 기능
        var dragger = this.$_instance.find(".title");
        dragger.on("mousedown", angular.bind( this, Util._onMouseDown, this));
        
    };
    */





























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
