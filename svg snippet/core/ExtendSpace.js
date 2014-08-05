﻿
//  requestAnimationFrame();
//    requestAnimationFrame Polyfill
//    More info:
//    http://paulirish.com/2011/requestanimationframe-for-smart-animating/

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {

        return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback, element) {
			    // callback : function FrameRequestCallback
			    // element : DOMElement Element
			    window.setTimeout(callback, 1000 / 60);
			};
    }());
}

(function ( document, window ) {

    ////////////////////////////////////////////////////////
    //
	// Version
	//
	// denpendancy : Space.js, ScaleMode.js, pep.js
    //
    ////////////////////////////////////////////////////////

    // 버전 기록
    var Version = {
        version:     "0.0.1",
        copyright:   "ⓒ pdi1066@naver.com",
        modify:      "20140724",

        getInfo: function () {
        	return "* ExtendSpace Version." + " "
                     + Version.version + " "
                     + Version.copyright + " "
                     + "(" + Version.modify + ")";
        }
    };

	// Space 상속
    var _superClass = window._Space;
    var _super_prototype = _superClass.prototype;

    ExtendedViewer.prototype = $.extend({}, _super_prototype, getProto());
    window._Space = ExtendedViewer;

    ////////////////////////////////////////////////////////
    //
    // CORE - Space
    //
    ////////////////////////////////////////////////////////

    function ExtendedViewer() {

    	console.log(Version.getInfo());
		// super()
    	_superClass.apply(this, arguments);
    }

    function getProto() {
    	return {
    		
    	    // super()
    	    _super: function(methodName, args){
    	        if(_super_prototype[methodName]){
                    _super_prototype[methodName].apply(this, args);
    	        }
    	    },

            /*
    		// Override
    		init: function (data) {
				// 초기화
    			// code...

				// super()
    		    this._super("init", arguments);

    		    return this;
    		},
            */

    	    //////////////////////////////////////////////////////
            //
    	    // scaleMode 기능 추가
            //
    	    //////////////////////////////////////////////////////

    		// 전체에 일괄적으로 customScale을 적용할지 여부
    		fixedScale: false,

    		// 일괄 적용할 scale 값
    		customScale: 1,

    		// Override
    		_computeScreenScale: function (screen, config) {

    			var compare = $(screen);
    			var source = config;
    			var scaleMode = new ScaleMode({
    				sourceWidth: source.width,
    				sourceHeight: source.height,
    				compareWidth: compare.width(),
    				compareHeight: compare.height()
    			});

				//SET
    			scaleMode.scale(ScaleMode.SCALE_WINDOW);
    			//scaleMode.scale(10);

				//GET
    			var scale = scaleMode.scale();

    			//-------------------------
    			// 고정 scale 기능 추가
    			//-------------------------

    			if (this.fixedScale && !isNaN(this.customScale)) {
    				scale = this.customScale * scale;
    			}

    			//-------------------------
    			// 최대, 최소 필터링
    			//-------------------------

    			// max, min
    			if (config.maxScale && scale > config.maxScale) {
    				scale = config.maxScale;
    			}

    			if (config.minScale && scale < config.minScale) {
    				scale = config.minScale;
    			}

    			//out("scale : ", scale, config);
    			return scale;
    		},

    		update: function (initObj) {
    		    if (initObj) {
    		        for (var prop in initObj) {
    		            if (prop in this) {
    		                this[prop] = initObj[prop];
    		            }
    		        }
    		    }

    		    this.goto(this.activeStep);
    		},
            
    	    //////////////////////////////////////////////////////
            //
    	    // 화면 드래그 기능 추가
            //
    	    //////////////////////////////////////////////////////

            // 오버라이딩
    		removeEventListener: function () {
    		    
    		    // super()
    		    this._super("removeEventListener", arguments);

    		    this.setDragable(false);
    		},
            
    	    // 오버라이딩
    		createEventListener: function () {
                
    		    // super()
    		    this._super("createEventListener", arguments);

    		    this.setDragable(this.__dragable);
    		},

    	    ///////////////////////////
    	    // 드래그 마우스 이벤트 ( 정상 동작하는 완성된 코드임)
    	    ///////////////////////////

    	    /*
    	    //-------------------------
    	    // 드래그 기능 조정
    	    //-------------------------

    	    // scale 고정인 경우 자동으로 화면 드래그가 가능하도록
    		__dragable: false,
    		setDragable: function (value) {
    		    if (this.__dragable == value) return;
    		    this.__dragable = value;

    		    $(this.screen).off("mousedown", $.proxy(this.__onMouseDown, this));
    		    if (value) {
    		        $(this.screen).on("mousedown", $.proxy(this.__onMouseDown, this));
    		    }

    		    // 마우스 드래그 방지, selection 방지
    		    this.setSelectable(value);
    		},

    	    //-------------------------
    	    // 마우스 드래그 방지, selection 방지 조정
    	    //-------------------------

    		setSelectable: function (value) {
    		    $(document).off("dragstart", $.proxy(this.__onDragstart, this));
    		    $(document).off("selectstart", $.proxy(this.__onSelectstart, this));

    		    if (value) {
    		        $(document).on("dragstart", $.proxy(this.__onDragstart, this));
    		        $(document).on("selectstart", $.proxy(this.__onSelectstart, this));
    		    }
    		},

    		__onDragstart: function (e) {
    		    e.preventDefault();
    		},

    		__onSelectstart: function (e) {
    		    e.preventDefault();
    		},

            //-------------------------
    	    // 마우스 드래그 기능
    	    //-------------------------

    		_tx: 0, _ty: 0,
    		_isMoved: false,

            __onMouseDown: function (e) {
                $(document).on("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).on("mouseup", $.proxy(this.__onMouseUp, this));

                this._isMoved = false;
                this._tx = e.pageX;
                this._ty = e.pageY;

                // DOWN 이벤트
                //this._move(0, 0);
            },

            __onMouseMove: function (e) {
                // 이동 거리
                var dx = e.pageX - this._tx;
                var dy = e.pageY - this._ty;

                //-------------------------
                // 처음 움직임 - position 설정 모드 전환 (50% --> px)
                //-------------------------

                if (!this._isMoved) {
                    this._isMoved = true;

                    // transition 없는 이동
                    this.css(this.viewport, {
                        transitionDuration: "0ms",
                        transitionDelay: "0ms"
                    });

                    // screen에 적용된 padding값에 의해 50% 계산치와  실제계산 값과 오차가 발생할 수 있다.
                    // (50% 로 지정된 상황에서 변경될때만 적용한다.)
                    if (this._isCenterPosition) {
                        // 보정치
                        var offsetX = this.getPureNumber($(this.screen).css("padding-left"));
                        var offsetY = this.getPureNumber($(this.screen).css("padding-top"));

                        var $viewport = $(this.viewport);
                        var tx = offsetX + this.getPureNumber($viewport.css("left"));
                        var ty = offsetY + this.getPureNumber($viewport.css("top"));

                        this.setPosition(tx, ty);
                    }
                }

                //-------------------------
                // MOVE 이벤트 위치 설정 
                //-------------------------

                this._move(dx, dy);

                this._tx = e.pageX;
                this._ty = e.pageY;
            },

            __onMouseUp: function (e) {
                $(document).off("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).off("mouseup", $.proxy(this.__onMouseUp, this));
            },

            __onClick: function (event) {
                // UP 이벤트만 실행
                if (this._isMoved) {
                    this._isMoved = false;
                    return;
                }

                // super()
                this._super("__onClick", arguments);
            },
            
            _move: function (dx, dy) {
                
                // 이동 거리
                var $viewport = $(this.viewport);
                var tx = this.getPureNumber($viewport.css("left")) + dx;
                var ty = this.getPureNumber($viewport.css("top")) + dy;

                // 적용
                this.setPosition(tx, ty);
            },
            */

    	    ////////////////////////////////////////////////////////
    	    //
    	    // Utility 함수
    	    //
    	    ////////////////////////////////////////////////////////

            getPureNumber: function (value) {
                if (typeof value == "number") return value;
			
                var regNum = /^\d+$/;	// numeric check
                var regPx = /px$/i;		// ends with 'px'
                // parse to integer.
                var numVal = 0;
                if (regNum.test(value)) {
                    numVal = parseInt(value, 10);
                } else if (regPx.test(value)) {
                    numVal = parseInt(value.substring(0, value.length - 2), 10);
                }
                return numVal;
            },

    	    //////////////////////////////////////////////////////
            //
    	    // 드래그 마우스 이벤트 - kinetic 적용
            //
    	    //////////////////////////////////////////////////////

    	    //-------------------------
    	    // 드래그 기능 조정
    	    //-------------------------

    	    // scale 고정인 경우 자동으로 화면 드래그가 가능하도록
            __dragable: false,
            setDragable: function (value) {
                if (this.__dragable == value) return;
                this.__dragable = value;

                /*
                $(this.screen).off("mousedown", $.proxy(this.__onMouseDown, this));
                if (value) {
                    $(this.screen).on("mousedown", $.proxy(this.__onMouseDown, this));
                }

                // 마우스 드래그 방지, selection 방지
                this.setSelectable(value);
                */


                드래그 마우스 이벤트 - pep.js를 적용 한다.
                - left, top이 50%로 설정되어 있어 현재 기능이 정상은 아님
                (space.js 278라인)
                - __click 메서드 오버라이딩되어 현재 막아놓음

                var pepObj = new K(this.trans);
            },

    	    //-------------------------
    	    // 마우스 드래그 방지, selection 방지 조정
    	    //-------------------------

            setSelectable: function (value) {
                $(document).off("dragstart", $.proxy(this.__onDragstart, this));
                $(document).off("selectstart", $.proxy(this.__onSelectstart, this));

                if (value) {
                    $(document).on("dragstart", $.proxy(this.__onDragstart, this));
                    $(document).on("selectstart", $.proxy(this.__onSelectstart, this));
                }
            },

            __onDragstart: function (e) {
                e.preventDefault();
            },

            __onSelectstart: function (e) {
                e.preventDefault();
            },

    	    //-------------------------
    	    // 마우스 드래그 기능
    	    //-------------------------
            /*
            _tx: 0, _ty: 0,
            _isMoved: false,

            __onMouseDown: function (e) {
                $(document).on("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).on("mouseup", $.proxy(this.__onMouseUp, this));

                this._isMoved = false;
                this._tx = e.pageX;
                this._ty = e.pageY;

                // DOWN 이벤트
                out("__onMouseDown");
            },

    	    // 마우스 움직임 중인 경우는 그냥 이동
    	    // 마우스 Up인 경우 속도를 계산하여 kinetic Animation을 실행한다.

            __onMouseMove: function (e) {
                // 이동 거리
                var dx = e.pageX - this._tx;
                var dy = e.pageY - this._ty;

                //-------------------------
                // 처음 움직임 - position 설정 모드 전환 (50% --> px)
                //-------------------------

                if (!this._isMoved) {
                    this._isMoved = true;

                    // transition 없는 이동
                    //this.css(this.viewport, {
                    //    transitionDuration: "0ms",
                    //    transitionDelay: "0ms"
                    //});

                    //$(this.viewport).pep({
                    //    hardwareAccelerate: false,
                    //    multiplier: 1.5
                    //});
                }

                //-------------------------
                // MOVE 이벤트 위치 설정 
                //-------------------------

                this._move(dx, dy);

                this._tx = e.pageX;
                this._ty = e.pageY;
                out("__onMouseMove");
            },

            __onMouseUp: function (e) {
                $(document).off("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).off("mouseup", $.proxy(this.__onMouseUp, this));

                out("__onMouseUp");
                //$.pep.unbind($(this.viewport));
                this._ease();
            },

            __onClick: function (event) {
                // UP 이벤트만 실행
                if (this._isMoved) {
                    this._isMoved = false;
                    return;
                }

                // super()
                this._super("__onClick", arguments);
            },

            _move: function (dx, dy) {

                // $(this.viewport)[0].style["transform"] => "perspective(2173.913043478261px) scale(0.46) translate3d(0px, 0px, 0px)"
                // 위 문자열에서 각 항목의 값을 추출한다. (값이 없는 경우는 default 값 적용)
                // perspective(2000px) scale(0.5) translate3d(983px, -53px, 0px)
                var cssString = $(this.viewport)[0].style["transform"];
                
                // 메서드 구분 : \b(scale)+\([\w,-\d\s\.]*?\)
                var perspective = this._parseTransform(cssString, "perspective");
                var scale = this._parseTransform(cssString, "scale");
                var translate3d = this._parseTransform(cssString, "translate3d");

                //out("*perspective : ", perspective);
                //out("*scale : ", scale);
                //out("*translate3d : ", translate3d);

                // 이동값 적용
                perspective = perspective ? perspective[0] : this.config.perspective;
                perspective = this.toNumber(perspective);

                var scale = scale ? scale[0] : this.config.scale;
                scale = this.toNumber(scale);

                var tx = translate3d ? translate3d[0] : 0;
                var ty = translate3d ? translate3d[1] : 0;
                var tz = translate3d ? translate3d[2] : 0;

                tx = this.toNumber(tx) + dx / scale;
                ty = this.toNumber(ty) + dy / scale;
                tz = this.toNumber(tz);// + dz;

                this.css(this.viewport, {
                    transform: this.perspectiveCSS(perspective)
                                + this.scaleCSS(scale)
                                + this.translateCSS({
                                    x: tx,
                                    y: ty,
                                    z: tz
                                }),
                    transitionDuration: 0 + "ms",
                    transitionDelay: 0 + "ms"
                });
            },

    	    // transform CSS 값 String을 파싱하여 값을 얻는다.
            _parseTransform: function (cssString, name) {
                var value = "[\\w,-\\d\\s\\.]*?";
                var pattern = "\\b(" + name + ")+\\(" + value + "\\)";

                var reg = new RegExp(pattern);
                var item = cssString.match(reg, "i");
                if (!item[0]) return;

                var num = /[-]?\d+(?:\.\d*)?/g;
                var valueAr = item[0].substring(item[0].indexOf("(")).match(num);
                return valueAr;
            },

            _ease: function () {
                out("translate velocity : ");
                // this.currentState값은 사용하지 않는다.
                // https://github.com/briangonzalez/jquery.pep.js
                // pep.js : 573
                // goto에 의해 원상태로 되돌아 가는 경우 translate3d(0px, 0px, 0px)으로 다시 세팅하던지 삭제하던지 한다.
                // up인 경우 kinetic을 적용한다.
            }
            */




















































    	    //////////////////////////////////////////////////////
    	    //
    	    // 드래그 마우스 이벤트 - pep 적용
    	    //
    	    //////////////////////////////////////////////////////

    	    _cssAnimationsSupport: false,
    	    _initializedDrag: false,

            _initializeDrag: function () {
                if (this._initializedDrag) return;
                this._initializedDrag = true;
                
                // IE Mouse Event (Win8)
                if (this.isPointerEventCompatible()) this.applyMSDefaults();

                this._cssAnimationsSupport = this.cssAnimationsSupported();
                //this.CSSEaseHash = this.getCSSEaseHash();

                this.scale = 1;
                this.started = false;

                // init----------------

                this.$el = $(this.trans);

                this.disableSelect();

                // place the object, if necessary.
                this.placeObject();

                // event 저장
                this.ev = {};
                // positions 저장
                //this.pos = {};
            },
            
            cssAnimationsSupported: function () {
                var animation = false,
                    elm = document.createElement('div'),
                    animationstring = 'animation',
                    keyframeprefix = '',
                    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
                    pfx = '';

                if (elm.style.animationName) { animation = true; }
                if (animation === false) {
                    for (var i = 0; i < domPrefixes.length; i++) {
                        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                            pfx = domPrefixes[i];
                            animationstring = pfx + 'Animation';
                            keyframeprefix = '-' + pfx.toLowerCase() + '-';
                            animation = true;
                            break;
                        }
                    }
                }
                return animation;
            },

    	    //-----------------------------------
    	    // IE Mouse Event (Win8)
    	    //-----------------------------------
            
    	    // touch Win8 device
            isPointerEventCompatible: function () {
                return ("MSPointerEvent" in window);
            },

            applyMSDefaults: function (first_argument) {
                this.$el.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none',
                    '-ms-scroll-chaining': 'none',
                    '-ms-scroll-limit': '0 0 0 0'
                });
            },

    	    //-----------------------------------
    	    // disable Select
    	    //-----------------------------------

    	    //  to not be selected user drags over text areas
    	    /*
            none : 사용자는 모든 요소의 content를 선택할 수 없다.
            text : 사용자는 text를 선택할 수 있다.
            toggle : 사용자는 toggle를 선택할 수 있다.
            element : 사용자는 한 번에 한 요소가 선택할 수 있다.
            elements : 사용자는 한 번에 하나 이상의 요소를 선택할 수 있다.
            all : 사용자는 전체 내용을 선택할 수 있다.
            */
            disableSelect: function () {
                this.$el.css({
                    '-webkit-touch-callout': 'none',
                    '-webkit-user-select': 'none',
                    '-khtml-user-select': 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none'
                });
            },

    	    //-----------------------------------
    	    // placeObject
    	    //-----------------------------------

            //_objectPlaced: false,
            placeObject: function () {

                //if (this._objectPlaced) return;
                //this._objectPlaced = true;

                this.offset = (this.hasNonBodyRelative()) ? this.$el.position() : this.$el.offset();

                // better to leave absolute position alone if it already has one.
                if (parseInt(this.$el.css('left'), 10)) this.offset.left = this.$el.css('left');
                if (parseInt(this.$el.css('top'), 10)) this.offset.top = this.$el.css('top');

                this.$el.css({
                    position: 'absolute',
                    top: this.offset.top,
                    left: this.offset.left
                });
            },

    	    // returns true if any parent other than the body has relative positioning
            hasNonBodyRelative: function () {
                var $relativeElement = this.$el.parents().filter(function () {
                    var $this = $(this);
                    return $this.is('body') || $this.css('position') === 'relative';
                });
                return $relativeElement.length > 1;
            },

    	    /////////////////////////////////////
    	    // MOVE 이벤트 리스너
    	    /////////////////////////////////////

            __onMouseDown: function (e) {

                // 오른쪽 마우스 눌림
                if (e.which === 3) return;

                this._initializeDrag();

                $(document).on("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).on("mouseup", $.proxy(this.__onMouseUp, this));

                // 드래그 방지
                e.preventDefault();

                this.onStart(e);
            },

    	    // 마우스 움직임 중인 경우는 그냥 이동
    	    // 마우스 Up인 경우 속도를 계산하여 kinetic Animation을 실행한다.

            __onMouseMove: function (e) {
                this.onMove(e);
            },

            __onMouseUp: function (e) {
                $(document).off("mousemove", $.proxy(this.__onMouseMove, this));
                $(document).off("mouseup", $.proxy(this.__onMouseUp, this));

                this.onStop(e);
            },

    	    /////////////////////////////////////
    	    // Start
    	    /////////////////////////////////////

            startX: 0, startY: 0,

            onStart: function (ev) {

                // only continue chugging if our start event is a valid move event.
                if (this.isValidMoveEvent(ev) == false) return;

                // 오른쪽 마우스 눌림
                if (ev.which === 3) return;

                //------------
                // 이벤트 실행
                //------------

                // IE10 Hack. Me not happy.
                if (this.isPointerEventCompatible() && ev.preventManipulation) ev.preventManipulation();

                // 이벤트 일반화
                ev = this.normalizeEvent(ev);
                //out({ type: 'event', event: ev.type });

                //------------
                // initiate event.
                //------------

                var isPrevented = this.options.initiate.call(this, ev, this);
                if (isPrevented) return;

                // 컨테이너와의 위치 체크
                this.placeObject();

                // hardware accelerate 체크
                this.hardwareAccelerate();

                //------------
                // 리셋
                //------------

                clearTimeout(this.restTimeout);

                // animation CSS 초기화
                if (this._cssAnimationsSupport) {
                    this.$el.css(this.getCSSEaseHash(true));
                }

                // 초기 위치 offset, touch/click event 저장.
                this.startX = this.ev.x = ev.x;
                this.startY = this.ev.y = ev.y;
                this.moveEvent = ev;

                // transform을 사용하지 않을때
                //this.initialPosition = this.initialPosition || this.$el.position();

                this.resetVelocityQueue();

                // 드래그 방지
                ev.preventDefault();

                //------------
                // 애니메이션
                //------------

                var self = this;
                this.active = true;

                (function watchMoveLoop() {
                    if (!self.active) return;
                    self.handleMove();
                    requestAnimationFrame(watchMoveLoop);
                })();
            },

    	    // returns true if we're on a non-touch device -- or --
    	    // if the event is **single** touch event on a touch device
            isValidMoveEvent: function (ev) {
                return (
                    !this.isTouch(ev) ||
                    (this.isTouch(ev) && ev.originalEvent && ev.originalEvent.touches && ev.originalEvent.touches.length === 1)
                );
            },

            resetVelocityQueue: function () {
                this.velocityQueue = new Array(5);
            },

    	    //-----------------------------------
    	    // hardwareAccelerate
    	    //-----------------------------------

            _hardwareAccelerated: false,

    	    // CSS3 hardware acceleration 추가
            hardwareAccelerate: function () {
                if (this.options.hardwareAccelerate == false) return;
                if (this._hardwareAccelerated == false) return;
                this._hardwareAccelerated = true;

                this.$el.css({
                    '-webkit-perspective': 1000,
                    'perspective': 1000,
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden'
                });
            },















































    	    // 실제 move 동작은 requestAnimationFrame을 이용한다.
            onMove: function (e) {
                //this.moveEvent = e;
                out("onMove");
            },
            onStop: function (e) {
                //this.handleStop(e);
                out("onStop");
            },



















            // 오버라이딩
            __onClick: function (event) {
                return;
                if (!this._isMoved) out("__onClick : 실행");
                if(this._isGotoPlaying) out("__onClick : GOTO 이동중");
                if (this._isEasingPlay) out("Easeing 중임", this._isEasingPlay);


                // UP 이벤트만 실행
                if (this._isMoved) {
                    this._isMoved = false;
                    return;
                }

                // super()
                this._super("__onClick", arguments);
            },

    	    /////////////////////////////////////
    	    // move
    	    /////////////////////////////////////

            ss_move: function (dx, dy) {

                var target = this.trans;
                var cssObj = this.getTransformCSS(target);
                cssObj.scale = 1;
                cssObj.tx += dx / cssObj.scale;
                cssObj.ty += dy / cssObj.scale;
                cssObj.tz += 0;//dz / cssObj.scale;

                /*
                this.css(target, {
                    transform: this.translateCSS({
                        x: cssObj.tx,
                        y: cssObj.ty,
                        z: cssObj.tz
                    }),
                    transitionDuration: 0 + "ms",
                    transitionDelay: 0 + "ms"
                });
                */

                out(dx, dy);
                var x = this.getPureNumber($(target).css("left")) + dx;
                var y = this.getPureNumber($(target).css("top")) + dy;
                $(target).css({ left: x, top: y });
            },

            sss_getTransformCSS: function (target) {

                // $(this.viewport)[0].style["transform"] => "perspective(2173.913043478261px) scale(0.46) translate3d(0px, 0px, 0px)"
                // 위 문자열에서 각 항목의 값을 추출한다. (값이 없는 경우는 default 값 적용)
                // perspective(2000px) scale(0.5) translate3d(983px, -53px, 0px)
                var cssString = target.style["transform"];

                // 메서드 구분 : \b(scale)+\([\w,-\d\s\.]*?\)
                var translate3d = this._parseTransform(cssString, "translate3d");
                out("*translate3d : ", translate3d);

                // 이동값 적용
                var tx = translate3d ? translate3d[0] : 0;
                var ty = translate3d ? translate3d[1] : 0;
                var tz = translate3d ? translate3d[2] : 0;

                tx = this.toNumber(tx);
                ty = this.toNumber(ty);
                tz = this.toNumber(tz);

                //tx = parseInt(tx, 10);
                //ty = parseInt(ty, 10);
                //tz = parseInt(tz, 10);

                return {
                    tx: tx, ty: ty, tz: tz
                };
            },

    	    // transform CSS 값 String을 파싱하여 값을 얻는다.
            sss__parseTransform: function (cssString, name) {
                var value = "[\\w,-\\d\\s\\.]*?";
                var pattern = "\\b(" + name + ")+\\(" + value + "\\)";

                var reg = new RegExp(pattern);
                var item = cssString.match(reg, "i");
                if (!item[0]) return;

                var num = /[-]?\d+(?:\.\d*)?/g;
                var valueAr = item[0].substring(item[0].indexOf("(")).match(num);
                return valueAr;
            },

    	    /////////////////////////////////////
    	    // ease
    	    /////////////////////////////////////

            sss__isEasingPlay: false,

            sss__ease: function () {

                var target = this.trans;
                // this.currentState값은 사용하지 않는다.
                // https://github.com/briangonzalez/jquery.pep.js
                // pep.js : 573
                // goto에 의해 원상태로 되돌아 가는 경우 translate3d(0px, 0px, 0px)으로 다시 세팅하던지 삭제하던지 한다.
                // up인 경우 kinetic을 적용한다.

                var vel = this.velocity();
                var dt = vel.dt;
                var dx = vel.x;
                var dy = vel.y;
                var dz = 0;

                // out("translate velocity : ", vel);

                var cssObj = this.getTransformCSS(target);
                cssObj.scale = 1;
                cssObj.tx += dx / cssObj.scale;
                cssObj.ty += dy / cssObj.scale;
                cssObj.tz += dz / cssObj.scale;

                //------------
                // 애니메이션 적용
                //------------

                var cssEaseString = "cubic-bezier(0.190, 1.000, 0.220, 1.000)";
                var cssEaseDuration = this.defaultDuration * 2;
                var cssEaseString = ["all", cssEaseDuration + "ms", cssEaseString].join(" ");

                this.css(target, {
                    transform: this.translateCSS({
                        x: cssObj.tx,
                        y: cssObj.ty,
                        z: cssObj.tz
                    }),
                    transitionDuration: cssEaseDuration + "ms",
                    transitionDelay: 0 + "ms",
                    transition: cssEaseString
                });

                //------------
                // 애니메이션이 끝났을때 rest event
                //------------

                this._isEasingPlay = true;
                out("Easing : 실행");

                var self = this;
                this.restTimeout = setTimeout(function () {
                    self.resetCSS();
                    self._isEasingPlay = false;
                    out("Easing : 종료");
                }, cssEaseDuration);
            },
            
            sss_resetCSS: function () {
                /*
                var target = this.trans;
                var cssEaseString = "ease-in-out";
                this.css(target, {
                    transition: "all " + this.defaultDuration + "ms " + cssEaseString
                });
                */
            },

    	    // using the LIFO, calculate velocity and return velocity in each direction (x & y)
            sss__velocityMultiplier: 5,
            sss_velocity: function () {
                var sumX = 0;
                var sumY = 0;
                var dt = 0;
                for (var i = 0; i < this.velocityQueue.length - 1; i++) {
                    if (this.velocityQueue[i]) {
                        sumX += (this.velocityQueue[i + 1].x - this.velocityQueue[i].x);
                        sumY += (this.velocityQueue[i + 1].y - this.velocityQueue[i].y);
                        dt = (this.velocityQueue[i + 1].time - this.velocityQueue[i].time);
                    }
                }

                // 각 방향의 velocity
                return { x: sumX * this._velocityMultiplier, y: sumY * this._velocityMultiplier, dt: dt };
            },

    		///////////////////////////
    		// END PROTOTYPE
    		///////////////////////////
    	}
    }
	

})(document, window);

























































