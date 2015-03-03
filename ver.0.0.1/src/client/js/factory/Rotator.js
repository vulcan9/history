
///////////////////////////////////////////////////
//
// Rotator - 회전 기능
//
///////////////////////////////////////////////////

//***************************************************************

// $dragger(드래그 대상)은 position:absolute로 설정되어 있어야 드래그 가능합니다.
//  사용 샘플은 최 하단에 있음

//*************************************************************** 

"use strict";

define( ['U'], function( U ) {

        // 선언
        function _factory() {
        	
        		out( 'Rotator 등록 : ' );

            ////////////////////////////////////////
            // 생성자
            ////////////////////////////////////////

            function Rotator (){
                this.dragUtil = {
                    // 위치 이동 저장
                    _startX : 0,
                    _startY : 0
                };

                // 드래그 방향 설정
                // both : 상하좌우 이동 가능
                // x : x축 방향으로만 이동 가능
                // y : y축 방향으로만 이동 가능
                this.direction = "both";

                // 드래그 감지 Dealy 오프셋 (pixel)
                this.delay = 0;

                // 드래그 적용 대상 ($객체임)
                this.dragTarget = null;

                // 현재 마우스 이벤트를 받고있는 이벤트 리스너 owner
                this.$currentEventTarget = null;

                this.startAngle = 0;
            }

            ////////////////////////////////////
            // Prototype
            ////////////////////////////////////

            Rotator.getDegreeFromCSS = function (dragTarget){
                var st = window.getComputedStyle(dragTarget, null);
                var tr = st.getPropertyValue("-webkit-transform") ||
                    st.getPropertyValue("-moz-transform") ||
                    st.getPropertyValue("-ms-transform") ||
                    st.getPropertyValue("-o-transform") ||
                    st.getPropertyValue("transform") ||
                    "FAIL";

                // With rotate(30deg)...
                // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
                //console.log('Matrix: ' + tr);

                var angle = 0;
                if(tr && tr != 'none'){
                    // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
                    var values = tr.split('(')[1].split(')')[0].split(',');
                    var a = values[0];
                    var b = values[1];
                    var c = values[2];
                    var d = values[3];

                    //var scale = Math.sqrt(a*a + b*b);
                    //console.log('Scale: ' + scale);

                    // arc sin, convert from radians to degrees, round
                    // next line works for 30deg but not 130deg (returns 50);
                    // var sin = b/scale;
                    // var angle = Math.round(Math.asin(sin) * (180/Math.PI));
                    angle = Math.atan2(b, a) * (180/Math.PI);
                    angle = Math.round(angle);
                }
                //angle = angle % 360;
                //if (angle < 0) angle = angle + 360;
                return angle;
            };

            Rotator.prototype = {
                addEvent : function (type, handler){
                    if(this.$dragger == null) return;
                    this.$dragger.on(type, handler);
                },

                removeEvent : function (type, handler){
                    if(this.$dragger == null) return;
                    this.$dragger.off(type, handler);
                },

                initialize : function($icon, initObj){
                    if(this.$dragger){
                        this.$dragger.off("mousedown", $.proxy(this._onMouseDown_rotate, this));
                        this.$dragger.off("click", $.proxy(this._onClick_rotate, this));
                    }

                    // 드래그 버튼 기능
                    this.$dragger = $icon;

                    if(this.$dragger){
                        this.$dragger.on("mousedown", $.proxy(this._onMouseDown_rotate, this));
                        this.$dragger.on("click", $.proxy(this._onClick_rotate, this));
                    }else{
                        return;
                    }

                    for(var prop in initObj){
                        if(prop in this){
                            this[prop] = initObj[prop];
                        }
                    }
                },

                //---------------------------
                // px 을 포함한 값 -> 숫자.
                //---------------------------
                //value = value.replace(/px/gi, "");
                getPureNumber : function (value) {
                    if (typeof value == "number") return value;
                    var num = parseFloat(value, 10);
                    return isNaN(num) ? (fallback || 0) : num;
                    return num;
                },

                ////////////////////////////////////
                // Drag
                ////////////////////////////////////

                // https://github.com/gthmb/jquery-free-transform
                // https://github.com/gthmb/jquery-free-transform/blob/master/js/jquery.freetrans.js
                // http://stackoverflow.com/questions/16193536/make-div-rotatable-in-every-browser
                // http://stackoverflow.com/questions/20366892/resizing-handles-on-a-rotated-element

                getDegreeFromMouse : function (target, mouseX, mouseY){
                    var offset = target.offset();
                    var centerX = (offset.left) + (target.width()/2);
                    var centerY = (offset.top) + (target.height()/2);
                    var radians = Math.atan2(mouseY - centerY, mouseX - centerX);
                    //radians += (2 * Math.PI);
                    var deg = (radians * (180 / Math.PI));
                    deg = Math.round(deg);
                    //deg = deg % 360;

                    return deg;
                },

                _onMouseDown_rotate : function (event){

                    this.$currentEventTarget = $(event.target);

                    var initEvent = $.Event("Rotator.dragStartInit");
                    this.$currentEventTarget.trigger(initEvent);

                    this.dragUtil._startX = event.pageX;
                    this.dragUtil._startY = event.pageY;

                    var $dragTarget = this.dragTarget || this.$currentEventTarget;
                    var x = $dragTarget.css("left");
                    var y = $dragTarget.css("top");
                    x = this.getPureNumber(x);
                    y = this.getPureNumber(y);

                    var angle = this.startAngle || Rotator.getDegreeFromCSS($dragTarget[0]);
                    //out('Rotate: ' + angle + 'deg');

                    this._origin = { x: x, y: y, angle:angle };
                    this._last = { x: x, y: y, angle:angle };

                    var target = $(document);
                    target.on("mousemove", $.proxy(this._onMouseMove_rotate, this));
                    target.on("mouseup", $.proxy(this._onMouseUp_rotate, this));

                    this._isMoved = false;
                },

                _onMouseMove_rotate : function (event){

                    var $dragTarget = this.dragTarget || this.$currentEventTarget;

                    // 이동 거리
                    var distX = event.pageX - this.dragUtil._startX;
                    var distY = event.pageY - this.dragUtil._startY;
                    var x = this._origin.x;
                    var y = this._origin.y;

                    var angle = this._origin.angle;
                    var curAngle = this.getDegreeFromMouse($dragTarget, event.pageX, event.pageY);
                    var startAngle = this.getDegreeFromMouse($dragTarget, this.dragUtil._startX, this.dragUtil._startY);

                    if(!this._isMoved)
                    {
                        // 드래그 delay 감지
                        if(this.delay > 0){
                            if(distX < this.delay && distY < this.delay){
                                return;
                            }
                        }

                        //var deg = this.getDegreeFromMouse($dragTarget, event.pageX, event.pageY);
                        var startEvent = $.Event("Rotator.dragStart", {distX:distX, distY:distY, x:x, y:y, angle:angle});
                        this.$currentEventTarget.trigger(startEvent);

                        this._isMoved = true;

                        // 드래그 중지
                        if(event.isDefaultPrevented() || startEvent.isDefaultPrevented()){
                            return;
                        }
                    }

                    //--------------------
                    // 방향 체크
                    //--------------------

                    if(this.direction == 'both' || this.direction == 'x'){
                        x = x + distX;
                    }
                    if(this.direction == 'both' || this.direction == 'y'){
                        y = y + distY;
                    }
                    angle = angle + curAngle - startAngle;

                    // 최종값 저장
                    //out("_onRotate : ", angle);
                    this._last = { x: x, y: y, angle:angle };

                    // 이벤트 발송
                    var newEvent = $.Event("Rotator.drag", {distX:distX, distY:distY, x:x, y:y, angle:angle});
                    this.$currentEventTarget.trigger(newEvent);

                    if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
                        return;
                    }

                    // 위치 갱신
                    $dragTarget.css('transform', 'rotate(' + angle + 'deg)');
                },

                _onMouseUp_rotate : function (event){
                    // var target = $(event.currentTarget);
                    var target = $(document);
                    target.off("mousemove", $.proxy(this._onMouseMove_rotate, this));
                    target.off("mouseup", $.proxy(this._onMouseUp_rotate, this));

                    if(this._isMoved){
                        this._isMoved = false;

                        // 이동 거리
                        var distX = event.pageX - this.dragUtil._startX;
                        var distY = event.pageY - this.dragUtil._startY;
                        var x = this._last.x;
                        var y = this._last.y;
                        var angle = this._last.angle;

                        // 이벤트 발송
                        //this.dispatchChangeEvent();
                        var newEvent = $.Event("Rotator.dragEnd", {distX:distX, distY:distY, x:x, y:y, angle:angle});
                        this.$currentEventTarget.trigger(newEvent);

                        if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
                            this.$currentEventTarget = null;
                            return;
                        }
                    }
                    this.$currentEventTarget = null;
                },

                // 마우스가 이동한 경우 Click 이벤트 막음
                _onClick_rotate : function (event){
                    if(this._isMoved){
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        this._isMoved = false;
                    }else{
                        var newEvent = $.Event("Rotator.clicked");
                        $(event.target).trigger(newEvent);

                        if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
                            this.$currentEventTarget = null;
                            return;
                        }
                    }
                    this.$currentEventTarget = null;
                }

                ////////////////////////////////
                // Prototype END
                ////////////////////////////////
                // _factory  end
            };

            ////////////////////////////////////////
            // END
            ////////////////////////////////////////

            // 서비스 객체 리턴
            return Rotator;
        }


        // 리턴
        _factory._regist = function(application){
            // 등록
            application.factory( 'Rotator', _factory );
        };
        return _factory;
    }
);










