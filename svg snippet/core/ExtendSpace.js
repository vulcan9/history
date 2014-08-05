
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



    //  Create our triggers based on touch/click device
    var startTrigger = "MSPointerDown touchstart mousedown";
    var moveTrigger = "MSPointerMove touchmove mousemove";
    var stopTrigger = "MSPointerUp touchend mouseup";



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
    		// Override super()
   		    this._super("init", arguments);
            */

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

    	    //-------------------------
    	    // 드래그 기능 조정
    	    //-------------------------

    	    // scale 고정인 경우 자동으로 화면 드래그가 가능하도록
    		__dragable: false,
    		setDragable: function (value) {
    		    if (this.__dragable == value) return;
    		    this.__dragable = value;

    		    $(this.screen).off(startTrigger, $.proxy(this.__onMouseDown, this));
                if (value) {
                    $(this.screen).on(startTrigger, $.proxy(this.__onMouseDown, this));
                }

                // 마우스 드래그 방지, selection 방지
                this.setSelectable(value);
                
    		    /*
                드래그 마우스 이벤트 - pep.js를 적용 한다.
                - left, top이 50%로 설정되어 있어 현재 기능이 정상은 아님
                (space.js 278라인)
                - __click 메서드 오버라이딩되어 현재 막아놓음
                */
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
    		__onDragstart: function (e) {e.preventDefault();},
    		__onSelectstart: function (e) {e.preventDefault();},

    	    //////////////////////////////////////////////////////
    	    //
    	    // 드래그 마우스 이벤트 - pep 적용
    	    //
    	    //////////////////////////////////////////////////////

    		options: {

    		    initiate: function () { },
    		    start: function () { },
    		    drag: function () { },
    		    stop: function () { },
    		    rest: function () { },

    		    // 클릭만 한 경우 해당 콜백함수는 호출 허용함 : 'stop', 'rest'
    		    //callIfNotStarted           : [],
    		    // start 지연
    		    startThreshold: [0, 0],

    		    multiplier: 1,
    		    velocityMultiplier: 5,

    		    //hardwareAccelerate         : true,

    		    // get more css ease params from [ http://matthewlein.com/ceaser/ ]
    		    shouldEase: true,
    		    cssEaseString: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
    		    cssEaseDuration: 2000,

    		    // "x", "y"
    		    axis: null,
    		    // snap
    		    //grid                     : [1, 1],

    		    // 천천히 드래그할때 bounce back 기능
    		    revert: false,
    		    // revert 실행여부 조건식 지정
    		    revertIf: function () { return true; },

    		    // 오른쪽 마우스 클릭에 의한 드래그 무시
    		    //ignoreRightClick            : true,
    		    //disableSelect               : true,
    		    // input박스에 포커싱 있을때 드래그 막음
    		    // elementsWithInteraction     : 'input'
    		},

    	    _cssAnimationsSupport: false,
    	    _initializedDrag: false,

            _initializeDrag: function () {
                if (this._initializedDrag) return;
                this._initializedDrag = true;
                
                // IE Mouse Event (Win8)
                if (this.isPointerEventCompatible()) this.applyMSDefaults();

                this._cssAnimationsSupport = this.cssAnimationsSupported();
                //this.CSSEaseHash = this.getCSSEaseHash();

                // 클수록 drag 감도 떨어짐(friction)
                this._dragScale = 1;
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

    	    /////////////////////////////////////
    	    // MOVE 이벤트 리스너
    	    /////////////////////////////////////

            __onMouseDown: function (e) {

                // 오른쪽 마우스 눌림
                if (e.which === 3) return;
                // GOTO 이동중
                //if (this._isGotoPlaying) return;

                this._initializeDrag();

                $(document).on(moveTrigger, $.proxy(this.__onMouseMove, this));
                $(document).on(stopTrigger, $.proxy(this.__onMouseUp, this));

                // 드래그 방지
                e.preventDefault();

                this.onStart(e);
            },

    	    // 마우스 움직임 중인 경우는 그냥 이동
    	    // 마우스 Up인 경우 속도를 계산하여 kinetic Animation을 실행한다.

    	    // 실제 move 동작은 requestAnimationFrame을 이용한다.
            __onMouseMove: function (e) {
                this.moveEvent = e;
            },

            __onMouseUp: function (e) {
                $(document).off(moveTrigger, $.proxy(this.__onMouseMove, this));
                $(document).off(stopTrigger, $.proxy(this.__onMouseUp, this));

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
                    self.onMove();
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

    	    // touch event 인지 여부
            isTouch: function (ev) {
                return ev.type.search('touch') > -1;
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

    	    //-----------------------------------
    	    // hardwareAccelerate
    	    //-----------------------------------

            _hardwareAccelerated: false,

    	    // CSS3 hardware acceleration 추가
            hardwareAccelerate: function () {
                if (this._hardwareAccelerated == false) return;
                this._hardwareAccelerated = true;

                this.$el.css({
                    '-webkit-perspective': 1000,
                    'perspective': 1000,
                    '-webkit-backface-visibility': 'hidden',
                    'backface-visibility': 'hidden'
                });
            },

    	    //-----------------------------------
    	    // 이벤트 wraping
    	    //-----------------------------------

            normalizeEvent: function (ev) {
                if (this.isPointerEventCompatible() || !this.isTouch(ev)) {

                    if (ev.pageX) {
                        ev.x = ev.pageX;
                        ev.y = ev.pageY;
                    } else {
                        ev.x = ev.originalEvent.pageX;
                        ev.y = ev.originalEvent.pageY;
                    }

                } else {
                    ev.x = ev.originalEvent.touches[0].pageX;
                    ev.y = ev.originalEvent.touches[0].pageY;
                }
                return ev;
            },

    	    // returns a hash of params used in conjunction with this.options.cssEaseString
            getCSSEaseHash: function (reset) {
                if (typeof (reset) === 'undefined') reset = false;

                var cssEaseString;
                if (reset) {
                    cssEaseString = '';
                } else if (this.CSSEaseHash) {
                    return this.CSSEaseHash;
                } else {
                    cssEaseString = ['all', this.options.cssEaseDuration + 'ms', this.options.cssEaseString].join(' ');
                }

                return {
                    '-webkit-transition': cssEaseString,   // chrome, safari, etc.
                    '-moz-transition': cssEaseString,   // firefox
                    '-ms-transition': cssEaseString,   // microsoft
                    '-o-transition': cssEaseString,   // opera
                    'transition': cssEaseString    // future
                };
            },

    	    /////////////////////////////////////
    	    // Move
    	    /////////////////////////////////////

            onMove: function () {

                if (typeof (this.moveEvent) === 'undefined') return;

                var ev = this.normalizeEvent(this.moveEvent);
                //var curX = window.parseInt(ev.x / this.options.grid[0]) * this.options.grid[0];
                //var curY = window.parseInt(ev.y / this.options.grid[1]) * this.options.grid[1];
                var curX = ev.x;
                var curY = ev.y;

                //------------
                // velocity 계산을 위해 데이터 저장 (last in, first out queue)
                //------------

                this.addToLIFO({ time: ev.timeStamp, x: curX, y: curY });

                var dx, dy;
                if (startTrigger.split(" ").indexOf(ev.type) > -1) {
                    dx = 0;
                    dy = 0;
                } else {
                    dx = curX - this.ev.x;
                    dy = curY - this.ev.y;
                }

                this.ev.x = curX;
                this.ev.y = curY;

                // 움직임 없음
                //if (dx === 0 && dy === 0) return;

                //------------
                // start event.
                //------------

                // out("TODO : 거리 계산으로 start event 시점 다시 할것.");

                // check if object has moved past X/Y thresholds if so, fire users start event
                var initialDx = Math.abs(this.startX - curX);
                var initialDy = Math.abs(this.startY - curY);

                if (!this.started && (initialDx > this.options.startThreshold[0] || initialDy > this.options.startThreshold[1])) {
                    this.started = true;
                    this.options.start.call(this, this.startEvent, this);
                }

                //------------
                // drag event.
                //------------

                var isPrevented = this.options.drag.call(this, ev, this);
                if (isPrevented === false) {
                    this.resetVelocityQueue();
                    return;
                }

                //------------
                // move
                //------------

                // log the move trigger & event position
                //out({ type: 'event', event: ev.type });
                //out({ type: 'event-coords', x: this.ev.x, y: this.ev.y });
                //out({ type: 'velocity' });

                this.doMoveTo(dx, dy);
            },

    	    // a Last-In/First-Out array of the 5 most recent velocity points
            addToLIFO: function (val) {
                var arr = this.velocityQueue;
                arr = arr.slice(1, arr.length);
                arr.push(val);
                this.velocityQueue = arr;
            },

            doMoveTo: function (dx, dy) {
                var xOp, yOp;

                // if using not using CSS transforms, move object via absolute position
                dx = (dx / this._dragScale) * this.options.multiplier;
                dy = (dy / this._dragScale) * this.options.multiplier;

                // 축 이동 고정
                if (this.options.axis === 'x') dy = 0;
                if (this.options.axis === 'y') dx = 0;

                this.moveToUsingTransforms(dx, dy);

                /*
                // 그냥 이동
                xOp = (dx >= 0) ? "+=" + Math.abs(dx / this._dragScale) * this.options.multiplier : "-=" + Math.abs(dx / this.scale) * this.options.multiplier;
                yOp = (dy >= 0) ? "+=" + Math.abs(dy / this._dragScale) * this.options.multiplier : "-=" + Math.abs(dy / this.scale) * this.options.multiplier;
                this.moveTo(xOp, yOp);
                */
            },

    	    // .css({top: "+=20", left: "-=30"}) syntax
            moveTo: function (x, y, animate) {
                //out({ type: 'delta', x: x, y: y });
                if (animate) {
                    this.$el.animate({ top: y, left: x }, 0, 'easeOutQuad', { queue: false });
                } else {
                    this.$el.stop(true, false).css({ top: y, left: x });
                }
            },

    	    /////////////////////////////////////
    	    // Stop
    	    /////////////////////////////////////

            onStop: function (ev) {

                if (!this.active) {
                    return;
                }
                this.active = false;
                //out({ type: 'event', event: ev.type });

                //------------
                // stop event.
                //------------

                if (this.started) {
                    this.options.stop.call(this, ev, this);
                }

                //------------
                // ease call
                //------------

                if (this.options.shouldEase) {
                    this.ease(ev, this.started);
                }

                //------------
                // bounce back call
                //------------

                if (this.options.revert && (this.options.revertIf && this.options.revertIf.call(this))) {
                    this.revert();
                }

                // this must be set to false after the user's stop event is called, so the dev has access to it.
                //this.started = false;

                // reset the velocity queue
                this.resetVelocityQueue();
            },

            revert: function () {
                this.moveToUsingTransforms(-this.xTranslation(), -this.yTranslation());
                //this.moveTo(this.initialPosition.left, this.initialPosition.top);
            },

    	    /////////////////////////////////////
    	    // Transforms
    	    /////////////////////////////////////

    	    /*
            [회전]   [-이동]  [확대] sx=sy=1
            | a c 0 || 1 0 e || sx  0 0 |
            | b d 0 || 0 1 f ||  0 sy 0 |
            | 0 0 1 || 0 0 1 ||  0  0 1 |
            [a, b, c, d, e, f]
            */
            moveToUsingTransforms: function (x, y) {
                
                // Check for our initial values if we don't have them.
                var matrixArray = this.matrixToArray(this.matrixString());
                if (!this.cssX) this.cssX = this.xTranslation(matrixArray);
                if (!this.cssY) this.cssY = this.yTranslation(matrixArray);

                // CSS3 transforms are additive from current position
                this.cssX = this.cssX + x;
                this.cssY = this.cssY + y;

                //out({ type: 'delta', x: x, y: y });

                //***********************************************************************************
                // scale
                /*
                matrixArray[0] = matrixArray[3] = 0.345;
          
                var value = "perspective(1904.7619047619046px) scale(0.525) translate3d("+this.cssX+"px, "+this.cssY+"px, 0px)";
                this.transform( this.translation );
                return;
                */
                //***********************************************************************************

                matrixArray[4] = this.cssX;
                matrixArray[5] = this.cssY;

                var translation = this.arrayToMatrix(matrixArray);
                this.transform(translation);
            },

            xTranslation: function (matrixArray) {
                matrixArray = matrixArray || this.matrixToArray(this.matrixString());
                return parseInt(matrixArray[4], 10);
            },

            yTranslation: function (matrixArray) {
                matrixArray = matrixArray || this.matrixToArray(this.matrixString());
                return parseInt(matrixArray[5], 10);
            },

    	    //-----------------------------------
    	    // CSS3 transforms Helper
    	    //-----------------------------------

            matrixString: function () {
                var validMatrix = function (o) {
                    return !(!o || o === 'none' || o.indexOf('matrix') < 0);
                };

                var matrix = "matrix(1, 0, 0, 1, 0, 0)";
                if (validMatrix(this.$el.css('-webkit-transform'))) matrix = this.$el.css('-webkit-transform');
                if (validMatrix(this.$el.css('-moz-transform'))) matrix = this.$el.css('-moz-transform');
                if (validMatrix(this.$el.css('-ms-transform'))) matrix = this.$el.css('-ms-transform');
                if (validMatrix(this.$el.css('-o-transform'))) matrix = this.$el.css('-o-transform');
                if (validMatrix(this.$el.css('transform'))) matrix = this.$el.css('transform');

                return matrix;
            },

            matrixToArray: function (str) {
                return str.split('(')[1].split(')')[0].split(',');
            },

            arrayToMatrix: function (array) {
                return "matrix(" + array.join(',') + ")";
            },

            transform: function (value) {
                this.$el.css({
                    '-webkit-transform': value,
                    '-moz-transform': value,
                    '-ms-transform': value,
                    '-o-transform': value,
                    'transform': value
                });
            },

    	    ////////////////////////////////////////////////////////////////
    	    //
    	    // ease 실행
    	    //
    	    ////////////////////////////////////////////////////////////////

    	    // LIFO queue를 사용하여 감속
            ease: function (ev, started) {

                var pos = this.$el.position();
                var vel = this.velocity();
                var dt = vel.dt;
                var x = (vel.x / this._dragScale) * this.options.multiplier;
                var y = (vel.y / this._dragScale) * this.options.multiplier;

                //out("translate velocity : ", vel);

                // Apply the CSS3 animation
                if (this._cssAnimationsSupport) this.$el.css(this.getCSSEaseHash());

                var xOp = (vel.x > 0) ? "+=" + x : "-=" + Math.abs(x);
                var yOp = (vel.y > 0) ? "+=" + y : "-=" + Math.abs(y);

                if (this.options.axis === 'x') yOp = "+=0";
                if (this.options.axis === 'y') xOp = "+=0";

                if (!started) {
                    return;
                }
                out("ease : ", started);

                //------------
                // 움직임
                //------------

                // ease it via JS, the last true tells it to animate.
                var jsAnimateFallback = !this._cssAnimationsSupport;
                this.moveTo(xOp, yOp, jsAnimateFallback);

                //------------
                // 애니메이션이 끝났을때 rest event
                //------------

                //this._isEasingPlay = true;

                var self = this;
                this.restTimeout = setTimeout(function () {
                    out("끝");
                    if (started) {
                        self.options.rest.call(self, ev, self);
                        //self._isEasingPlay = false;
                    }
                }, this.options.cssEaseDuration);
            },

    	    // using the LIFO, calculate velocity and return velocity in each direction (x & y)
            velocity: function () {
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
                return { x: sumX * this.options.velocityMultiplier, y: sumY * this.options.velocityMultiplier, dt: dt };
            },

    	    ////////////////////////////////////////////////////////
    	    //
    	    // 클릭 (오버라이딩)
    	    //
    	    ////////////////////////////////////////////////////////

            // 오버라이딩
            __onClick: function (event) {
                
                if (this.__dragable) {
                    if (this.started) {
                        this.started = false;
                        //event.stopPropagation();
                        //event.preventDefault();
                        //event.stopImmediatePropagation();
                        return;
                    }

                    // GOTO 이동중
                    //if (this._isGotoPlaying) return;

                    var ev = this.normalizeEvent(event);
                    if (this.startX != ev.x || this.startY != ev.y) {
                        return;
                    }
                }

                // super()
                this._super("__onClick", arguments);
            },

            setPosition: function (isCenter) {

                // 원상태로 복귀 (taansform 리셋)
                if (this.$el) {
                    var matrixArray = this.matrixToArray(this.matrixString());
                    var x = this.xTranslation(matrixArray);
                    var y = this.yTranslation(matrixArray);

                    // 같은 위치에서 animation에 의해 미세하게 떨림을 방지
                    if (x == 0 && y == 0) return;

                    this.moveToUsingTransforms(-x, -y);
                }

                // super()
                this._super("setPosition", arguments);
            },

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

    		///////////////////////////
    		// END PROTOTYPE
    		///////////////////////////
    	}
    }
	

})(document, window);

























































