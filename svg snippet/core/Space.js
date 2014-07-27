
(function ( document, window ) {

    ////////////////////////////////////////////////////////
    //
    // Version
    //
    ////////////////////////////////////////////////////////

    // 버전 기록
    var Version = {
        version:     "0.0.1",
        copyright:   "ⓒ pdi1066@naver.com",
        modify:      "20140724",

        getInfo: function () {
        	return "* Space Version." + " "
                     + Version.version + " "
                     + Version.copyright + " "
                     + "(" + Version.modify + ")";
        }
    };
    
    //-------------------------
    // window Resize Event
    //-------------------------

	(function addResizeEvent() {
		var self = this;
		var _resizing = false;
		var _watchResizingID = -1;
		$(window).on("resize", function () {
			if (_watchResizingID != -1) {
				clearTimeout(_watchResizingID);
				_watchResizingID = -1;
			}

			_watchResizingID = setTimeout(function () {
				clearTimeout(_watchResizingID);
				_watchResizingID = -1;

				// fixed : "resize" 이름으로 이벤트를 trigger하면
				// resize 이벤트가 계속해서 dispatch 됨
				// (resize 이벤트가 버블링 되는것 같음)
				
				// viewContainer에서 resized 이벤트 발송
				$(window).trigger("resizedWindow");
			}, 500);
		});
	})();

	//-------------------------
	// META 태그
	//-------------------------

	// <meta> Tag: 모바일 디바이스를 위해 viewport 세팅
	function setMetaTag() {
		var meta = document.querySelector("meta[name='viewport']") || document.createElement("meta");
		meta.content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no";
		if (meta.parentNode !== document.head) {
			meta.name = 'viewport';
			document.head.appendChild(meta);
		}
	}

    ////////////////////////////////////////////////////////
    //
    // CORE - Space
    //
    ////////////////////////////////////////////////////////

	var DEFAULT_DURATION = 500;

	function Space(screenID) {

	    console.log(Version.getInfo());

    	//-------------------------
    	// support 브라우져 체크
    	//-------------------------

    	var impressSupported = this.checkSupport();
    	
    	if (!impressSupported) {
    		alert("Not Support CSS");
    	}

    	// META 태그
    	setMetaTag();

    	//-------------------------
    	// 인스턴스
    	//-------------------------

        // screen element ID
    	this.screenID = screenID;
    	this.initialized = false;
    	out("# API SCREEN ID : ", screenID);
    }

	Space.prototype = {
    	screen: null,
    	viewport:null,
    	canvas: null,
    	
    	// 각 step의 설정 데이터 (transition 정보를 저장)
    	__stepsData: {},
    	stepData: function (elementID, value) {
    	    //GET
    	    if (value === undefined) return this.__stepsData["impress-" + elementID];

    	    // SET
    	    this.__stepsData["impress-" + elementID] = value;
    	},

		// step (DOM) 목록
		steps: null,

    	// 현재 활성화 상태의 (active step) element
    	activeStep: null,
    	// current state (position, rotation and scale) of the presentation
    	currentState: null,

    	// trasition 설정값
    	config: null,
    	// trasition (default) 설정값
    	defaults: {
    		width: 1024,
    		height: 768,
    		maxScale: 50,
    		minScale: 0.01,
    		perspective: 1000,
    		transitionDuration: DEFAULT_DURATION
    	},

    	// scale factor of the browser window
    	windowScale: null,

    	//////////////////////////////////////////////////////
    	// INIT
    	//////////////////////////////////////////////////////

    	// data: step 노드(DIV)가 기술된 HTML 목록
    	_documentData: null,

    	// data : documentData 세팅
    	init: function (data) {

    		if (this.initialized) {
    			// data가 있으면 다시 세팅함
    			if (this._documentData === data) return;
    			this.initialized = false;
    		}
    		this._documentData = data;
    		
    		//-------------------------
    		// DOM 구조 설정
    		//-------------------------

    		this._createDOM();
    		
    		//-------------------------
    		// 설정값(congig) 초기화 설정
    		//-------------------------

    		// 설정값 초기화
    		var rootData = this.viewport.dataset;
    		var defaults = this.defaults;
    		this.config = {
    			width:              this.toNumber(rootData.width, defaults.width),
    			height:             this.toNumber(rootData.height, defaults.height),
    			maxScale:           this.toNumber(rootData.maxScale, defaults.maxScale),
    			minScale:           this.toNumber(rootData.minScale, defaults.minScale),
    			perspective:        this.toNumber(rootData.perspective, defaults.perspective),
    			transitionDuration: this.toNumber(rootData.transitionDuration, defaults.transitionDuration)
    		};

    		// scale factor 계산하기
    		var win = this.screen;
    		this.windowScale = this._computeScreenScale(win, this.config);
    		//out("this.windowScale : ", this.windowScale);

    		// currentState 초기화
    		this.currentState = {
    			translate: { x: 0, y: 0, z: 0 },
    			rotate: { x: 0, y: 0, z: 0 },
    			scale: 1
    		};

    		//-------------------------
    		// 화면 업데이트
    		//-------------------------

    		// root
    		var rootStyles = {
    			position:        "absolute",
    			transformOrigin: "top left",
    			transition:      "all 0s ease-in-out",
    			transformStyle:  "preserve-3d"
    		};
    		this.css(this.viewport, rootStyles);
    		this.setPosition(true);
    		this.css(this.viewport, {
    			transform: this.perspectiveCSS(this.config.perspective / this.windowScale) + this.scaleCSS(this.windowScale)
    		});
    		
    		// canvas
    		this.css(this.canvas, rootStyles);

    		//-------------------------
    		// 데이터 적용
    		//-------------------------

    		this._resetContent(this._documentData);

    		//-------------------------
    		// 이벤트 리스너 설정
    		//-------------------------

    		this.initialized = true;
    		var isReset = (!this._documentData || this._documentData.length < 1);

    		if (isReset) {
    		    this.removeEventListener();
    		} else {
    		    this.createEventListener();
    		}
    		
    		//-------------------------
    		// 초기화 종료 이벤트
    		//-------------------------

    		this.triggerEvent(this.viewport, "impress:init", { api: API(this.screenID) });
    		if (isReset) return;

    	    //-------------------------
    	    // START 
    	    //-------------------------

    		// by selecting step defined in url or first step of the presentation
    	    //var step = hash || this._getElementFromHash() || "overview" || this.steps[0];
    		var step = this._getElementFromHash() || "overview" || this.steps[0];
            this.goto( step, DEFAULT_DURATION);

            return this;
    	},
    	
	    //-------------------------
	    // 위치 설정 
	    //-------------------------

        // center 맞춤으로 CSS가 설정되어 있는지 (50%)
    	_isCenterPosition: false,

	    // 주의 : screen에 적용된 padding값에 의해 50% 계산치와  실제계산 값과 오차가 발생할 수 있다.
	    // 중앙 : setPosition(true)
	    // 위치 : setPosition(100, 100)
    	setPosition: function (isCenter) {

    	    if (arguments.length === 1) {
    	        var isCenter = arguments[0];
    	        if (isCenter === true) {
    	            // true, false로 설정하여 50%, 50%로 설정함
    	            this.css(this.viewport, { left: "50%", top: "50%" });
    	            this._isCenterPosition = true;
    	        }
    	        return;
    	    }

    	    if (arguments.length === 2) {
    	        var x = arguments[0];
    	        var y = arguments[1];

    	        // 직접 px 값으로 설정함
    	        this.css(this.viewport, { left: x + "px", top: y + "px" });
    	        this._isCenterPosition = false;
    	        return;
    	    }

    	    throw new Error("# [setPosition] 메서드가 잘못 사용되었습니다.");
    	},

        ///////////////////////////
        // DOM 구조 생성
        ///////////////////////////

    	_createDOM: function () {

    	    // DOM screen
    	    var $screen = $("#" + this.screenID)
				.addClass("u-screen");
    	    this.screen = $screen[0];

    	    $screen.empty();

    	    // DOM viewport
    	    var $viewport = $("<div>")
				.attr("id", "u-viewport")
				.addClass("u-viewport");
    	    $screen.append($viewport);
    	    this.viewport = $viewport[0];

    	    // DOM cnvas
    	    var $canvas = $("<div>")
				.attr("id", "u-canvas")
				.addClass("u-canvas");
    	    $viewport.append($canvas);
    	    this.canvas = $canvas[0];

    	    //out("# DOM : ", this.screen);
    	},

        ///////////////////////////
        // 데이터대로 Content DOM을 생성
        ///////////////////////////

    	_resetContent: function (documentData) {

    	    if (!documentData || documentData.length < 1) {
    	        this.steps = null;
    	        this.__stepsData = {};
    	        return;
    	    }

    	    //-------------------------
    	    // canvas DOM 생성 (documents 데이터)
    	    //-------------------------

    	    // "canvas" element로 모두 생성. (wrap steps)
    	    var len = documentData.length;
    	    var html = "";
    	    for (var i = 0; i < len; ++i) {
    	        html += documentData[i];
    	    }
    	    this.canvas.innerHTML = html;

    	    //-------------------------
    	    // canvas DOM Style
    	    //-------------------------

    	    this.steps = this._getStepList(this.canvas);
    	    //this.steps.forEach(this.initStep);

    	    var self = this;
    	    this.steps.forEach.apply(this.steps, [function () {
    	        self._initializeStep.apply(self, arguments);
    	    }]);
    	},

        // canvas내에 있는 step Node의 목록을 리턴
    	_getStepList: function (canvas) {
    		var documentList = this.arrayify(canvas.childNodes);
    	    return documentList;
    	},

    	// data- attribute에 설정된 data로 step element를 초기화 시키고 style을 수정한다.
    	_initializeStep: function (el, idx) {

    		// 아이디는 꼭 설정되어져 있어야함
    		// id가 설정되어 있지 않으면 고유 UID 설정해 준다.
    		if (!el.id) {
    			el.id = this.createUID();
    		}
    		
    		//-------------------------
    		// transition 데이터 구성
    		//-------------------------

    		var data = el.dataset;
    		var step_data = {
    			translate: {
    				x: this.toNumber(data.x),
    				y: this.toNumber(data.y),
    				z: this.toNumber(data.z)
    			},
    			rotate: {
    				x: this.toNumber(data.rotateX),
    				y: this.toNumber(data.rotateY),
    				z: this.toNumber(data.rotateZ || data.rotate)
    			},
    			scale: this.toNumber(data.scale, 1),
    			el: el
    		};

    		// stepsData에 기록해 놓음
    		this.stepData(el.id, step_data);

    		//-------------------------
    		// element에 CSS 적용
    		//-------------------------

    		this.css(el, {
    			position: "absolute",
    			transform: "translate(-50%,-50%)" +
						   this.translateCSS(step_data.translate) +
						   this.rotateCSS(step_data.rotate) +
						   this.scaleCSS(step_data.scale),
    			transformStyle: "preserve-3d"
    		});

    		//-------------------------
    		// 형식에 맞는 문서 모양을 지정함
    		//-------------------------

    		el.classList.add("u-document");
    	},

    	//////////////////////////////////////////////////////
    	// GOTO
    	//////////////////////////////////////////////////////

    	// used to reset timeout for `impress:stepenter` event
    	_stepEnterTimeout: null,

    	// el : index (number), id (string) or element (dom Element)
    	// duration : second (optionally)
    	goto: function (el, duration) {

    		el = this._getStep(el);
    		if (!this.initialized || !(el)) {
    			return false;
    		}

    		// 키보드 등의 동작으로 가끔 브라우져가 페이지를 스크롤 하는 현상을 임시로 해결해 놓은 코드임.
    		window.scrollTo(0, 0);

    		//-------------------------
    		// canvas state
    		//-------------------------

    		var data = this.stepData(el.id);
    		
    		// compute target state of the canvas based on given step
    		var target = {
    			rotate: {
    			    x: -data.rotate.x,
    			    y: -data.rotate.y,
    			    z: -data.rotate.z
    			},
    			translate: {
    			    x: -data.translate.x,
    			    y: -data.translate.y,
    			    z: -data.translate.z
    			},
    			scale: 1 / data.scale
    		};

    		//-------------------------
    		// zoom in or out 여부에 따라 transition 순서를 조절해야 한다.
    		//-------------------------

    		// transition 이 zoom in 또는 zoom out인지를 판별한다.
    		// zoom in 경우 : move, rotate transition 을 시작한 후(delay) scaling을 시도한다.
    		// zoom out 경우 : scaling down 후(delay) move, rotate 를 시도한다.
    		var zoomin = target.scale >= this.currentState.scale;

    		duration = this.toNumber(duration, this.config.transitionDuration);
    		var delay = (duration / 2);

    		//-------------------------
    		// scale 계산
    		//-------------------------

    		// 같은 step 이 다시 선택된 상태 이더라도 windowScale을 다시 계산한다.
    		// (woindow 창 크기 조정에 의해 발생될 가능성이 있기 때문에)
    		if (el === this.activeStep) {
    			var win = this.screen;
    			this.windowScale = this._computeScreenScale(win, this.config);
    		}

    		var targetScale = target.scale * this.windowScale;

    		//-------------------------
    		// onStepLeave 이벤트
    		//-------------------------

    		// trigger leave of currently active element (if it's not the same step again)
    		if (this.activeStep && this.activeStep !== el) {
    			this._onStepLeave(this.activeStep);
    		}
			
    		//-------------------------
    		// transition 적용 - viewport, canvas
    		//-------------------------

    		// viewport : scale 을 조정한다.
    		// canvas : translate, rotation 제어
    		// root와 canvas는 각각 다른 delay 시간을 가지고 개별적으로 transition이 시작된다. (자연스러운 효과를 위한것임)
    		// 때문에 두개의 transition이 언제 끝났는지알 필요가 있다.

    	    // 드래그 기능 추가에 의해 항상 center일수만은 없으므로 체크 해줌
    		this.setPosition(true);

    		this.css(this.viewport, {
    			// to keep the perspective look similar for different scales
    			// we need to 'scale' the perspective, too
    			transform: this.perspectiveCSS(this.config.perspective / targetScale) + this.scaleCSS(targetScale),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? delay : 0) + "ms"
    		});

    		this.css(this.canvas, {
    			transform: this.rotateCSS(target.rotate, true) + this.translateCSS(target.translate),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? 0 : delay) + "ms"
    		});

    		//-------------------------
    		// Effect 종료 체크
    		//-------------------------

    		// If there is no change in scale or no change in rotation and translation, it means there was actually
    		// no delay - because there was no transition on `root` or `canvas` elements.
    		// We want to trigger `impress:stepenter` event in the correct moment, so here we compare the current
    		// and target values to check if delay should be taken into account.
    		//
    		// I know that this `if` statement looks scary, but it's pretty simple when you know what is going on
    		// - it's simply comparing all the values.
    		var currentState = this.currentState;
    		if (currentState.scale === target.scale ||
                (currentState.rotate.x === target.rotate.x && currentState.rotate.y === target.rotate.y &&
                 currentState.rotate.z === target.rotate.z && currentState.translate.x === target.translate.x &&
                 currentState.translate.y === target.translate.y && currentState.translate.z === target.translate.z)) {
    			delay = 0;
    		}

    		//-------------------------
    		// 변경 내용 기록
    		//-------------------------

    		// store current state
    		this.currentState = target;

    		// activeStep 변경
    		this._stepChanged(el);
    		this.activeStep = el;
    		
    		//-------------------------
    		// onStepEnter 이벤트
    		//-------------------------

    		// And here is where we trigger `impress:stepenter` event.
    		// We simply set up a timeout to fire it taking transition duration (and possible delay) into account.
    		// If you want learn something interesting and see how it was done with `transitionend` go back to
    		// version 0.5.2 of impress.js: http://github.com/bartaz/impress.js/blob/0.5.2/js/impress.js

    		// 2개의 transition 종료 시점에 이벤트 발생시킴
    		window.clearTimeout(this._stepEnterTimeout);

    		var self = this;
    		this._stepEnterTimeout = window.setTimeout(function () {
    			self._onStepEnter(self.activeStep);
    		}, duration + delay);
			
    		return el;
    	},

    	// parameter에 해당하는 step element 를 반환한다.
    	// number 이면 index로 찾는다.
    	// string 이면 id 로 찾는다
    	// DOM element 이면 올바른 step element 인지 확인 후 리턴
    	_getStep: function (step) {
    		if (typeof step === "number") {
    			var list = this.steps;
    			step = step < 0 ? list[list.length + step] : list[step];
    		} else if (typeof step === "string") {
    			step = document.getElementById(step);
    		}
    		if (!step) return null;

    		var data = this.stepData(step.id);
    		return (step && step.id && data) ? step : null;
    	},
		
    	_stepChanged: function(el){
    		// 활성화 step 정보 수정
    		if (this.activeStep) {
    			this.activeStep.classList.remove("active");
    			this.screen.classList.remove("active-" + this.activeStep.id);
    		}
    		el.classList.add("active");
    		this.screen.classList.add("active-" + el.id);
    	},

    	///////////////////////////
    	// prev, next
    	///////////////////////////

    	// goes to previous step (in document order)
    	prev: function () {
    		var list = this.steps;
    		var prev = list.indexOf(this.activeStep) - 1;
    		prev = prev >= 0 ? list[prev] : list[list.length - 1];

    		return this.goto(prev);
    	},

		// goes to next step (in document order)
    	next: function () {
    		var list = this.steps;
    		var next = list.indexOf(this.activeStep) + 1;
    		next = next < list.length ? list[next] : list[0];

			return this.goto(next);
		},

    	///////////////////////////
    	// scale
    	///////////////////////////

    	// scale factor : 설정된 값과 window 크기 사이에서 scale factor을 연산
		_computeScreenScale: function (screen, config) {

    	    var $win = $(screen);
    		var wScale = $win.width() / config.width;
    		var hScale = $win.height() / config.height;

    		var scale = hScale > wScale ? wScale : hScale;

    		if (config.maxScale && scale > config.maxScale) {
    			scale = config.maxScale;
    		}

    		if (config.minScale && scale < config.minScale) {
    			scale = config.minScale;
    		}

			return scale;
    	},

		////////////////////////////////////////////////////////
		//
		// Utility 함수
		//
		////////////////////////////////////////////////////////

		// 숫자화 (fallback : 숫자 변환 실패시 반환값)
		toNumber: function (numeric, fallback) {
			return isNaN(numeric) ? (fallback || 0) : Number(numeric);
		},

		// `arraify` takes an array-like object and turns it into real Array to make all the Array.prototype goodness available.
		arrayify: function (a) {
			return [].slice.call(a);
		},

		/*
		// 중첩 실행되지 않도록delaytime 후에 함수 호출
		// http://remysharp.com/2010/07/21/throttling-function-calls/
		function throttle(fn, delay, context) {
			var timer = null;
			return function () {
				context = context || this;
				var args = arguments;
		
				clearTimeout(timer);
				timer = setTimeout(function () {
					fn.apply(context, args);
				}, delay);
			};
		};
		*/

		// uid 생성
		createUID: function () {
			var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
			var uid = uid.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});

			return uid;
		},
		
		//-------------------------
		// CHECK SUPPORT
		//-------------------------

		checkSupport: function () {
			var ua = navigator.userAgent.toLowerCase();

			// browser should support CSS 3D transtorms 
			var support = (this.pfx("perspective") !== null) &&
							// classList, dataset HTML5 API가 지원되는지 확인
							(document.body.classList) && (document.body.dataset) &&

							// but some mobile devices need to be blacklisted,
							// because their CSS 3D support or hardware is not
							// good enough to run impress.js properly, sorry...
							(ua.search(/(iphone)|(ipod)|(android)/) === -1);
			return support;
		},

		//-------------------------
		// CSS
		//-------------------------

		// element에 props Object의 값으로 style을 설정한다.
		// 모든 속성 이름은 pfx 함수를 통해 버전에 따른 올바른 접두어를 사용할수 있도록 바뀐다.
		css: function (el, props) {
			var key, pkey;
			for (key in props) {
				if (props.hasOwnProperty(key)) {
					pkey = this.pfx(key);
					if (pkey !== null) {
						el.style[pkey] = props[key];
					}
				}
			}
			return el;
		},

		// 매개 변수로 표준 CSS 속성 이름을 받아 내부적으로 실행하여
		// 브라우저에서 사용할 수 있는 유효한 prefixed version의 이름을 반환하는 
		// 함수를 리턴해줌
		// The code is heavily inspired by Modernizr http://www.modernizr.com/
		pfx: function (prop) {
			var dummy = document.createElement('dummy');
			var style = dummy.style;
			var prefixes = 'Webkit Moz O ms Khtml'.split(' ');
			var memory = {};

			if (typeof memory[prop] === "undefined") {
				var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1);
				var props = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

				memory[prop] = null;
				for (var i in props) {
					if (style[props[i]] !== undefined) {
						memory[prop] = props[i];
						break;
					}
				}
			}
			dummy = null;
			return memory[prop];
		},

		//-------------------------
		// Transition
		//-------------------------

		translateCSS: function (t) {
			return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
		},

		// By default the rotations are in X Y Z order that can be reverted by passing `true` as second parameter.
		rotateCSS: function (r, revert) {
			var rX = " rotateX(" + r.x + "deg) ";
			var rY = " rotateY(" + r.y + "deg) ";
			var rZ = " rotateZ(" + r.z + "deg) ";

			return revert ? rZ + rY + rX : rX + rY + rZ;
		},

		scaleCSS: function (s) {
			return " scale(" + s + ") ";
		},

		// `perspective` builds a perspective transform string for given data.
		perspectiveCSS: function (p) {
			return " perspective(" + p + "px) ";
		},

		////////////////////////////////////////////////////////
		//
		// 이벤트
		//
		////////////////////////////////////////////////////////

		// `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
		// and triggers it on element given as `el`.
		triggerEvent: function (el, eventName, detail) {
			var event = document.createEvent("CustomEvent");
			event.initCustomEvent(eventName, true, true, detail);
			el.dispatchEvent(event);
		},
		
    	///////////////////////////
    	// STEP EVENTS - 2가지
    	///////////////////////////

    	// impress:stepleave : step is left (다음 step의 transition이 시작될때).
    	// impress:stepenter : step이 screen에 보여질때 (이전 step으로부터 transition이 끝났을때)

    	// reference to last entered step
    	_lastEntered: null,

    	_onStepLeave: function (step) {
    		if (this._lastEntered === step) {
    			out("* Event #impress:stepleave");
    			this.triggerEvent(step, "impress:stepleave");
    			this._lastEntered = null;
    		}
    	},

    	// step이 활성화(entered)될때 호출됨
    	// 이벤트는 lastEntered 와 다를때만 trigger됨.
    	_onStepEnter: function (step) {
    		if (this._lastEntered !== step) {
    			out("* Event #impress:stepenter");
    			this.triggerEvent(step, "impress:stepenter");

    			// hash 변경
    			// `#/step-id` is used instead of `#step-id` to prevent default browser scrolling to element in hash.
    			// And it has to be set after animation finishes, because in Chrome it makes transtion laggy.
    			// BUG: http://code.google.com/p/chromium/issues/detail?id=62820

    			window.location.hash = this.__lastHash = "#/" + step.id;

    			this._lastEntered = step;
    		}
    	},
		
		///////////////////////////
    	// 윈도우 이벤트
		///////////////////////////

    	removeEventListener: function () {
    		$(window).off("resizedWindow", $.proxy(this.__onResize, this));

    		$(window).off("keydown", $.proxy(this.__onKeydown, this));
    		$(window).off("keyup", $.proxy(this.__onKeyup, this));

    		$(this.screen).off("click", $.proxy(this.__onClick, this));
    		$(document).off("touchstart", $.proxy(this.__onTouch, this));

    		$(window).off("hashchange", $.proxy(this.__onHashchange, this));
    	},

    	createEventListener: function () {
    		this.removeEventListener();

    		$(window).on("resizedWindow", $.proxy(this.__onResize, this));

    		$(window).on("keydown", $.proxy(this.__onKeydown, this));
    		$(window).on("keyup", $.proxy(this.__onKeyup, this));

    		$(this.screen).on("click", $.proxy(this.__onClick, this));
    		$(document).on("touchstart", $.proxy(this.__onTouch, this));

    		$(window).on("hashchange", $.proxy(this.__onHashchange, this));
    	},

    	//-------------------------
    	// 리사이징 이벤트
    	//-------------------------

    	__onResize: function () {
    		// 현재 활성화 문서에서 goto를 통해 화면 업데이트 실행
    		this.goto(this.activeStep);
    	},

    	//-------------------------
    	// KEY 이벤트
    	//-------------------------

    	// 9:tab, 
    	// 32:space, 33:pg up, 34:pg down, 
    	// 37:left, 38:up, 39:right, 40:down

    	// Prevent default keydown action when one of supported key is pressed.
    	__onKeydown: function (event) {
    		var key = event.keyCode;
    		if (key === 9 || (key >= 32 && key <= 34) || (key >= 37 && key <= 40)) {
    			event.preventDefault();
    		}
    		//out("__onKeydown", key);
    	},

    	__onKeyup: function (event) {
    		var key = event.keyCode;
    		if (key === 9 || (key >= 32 && key <= 34) || (key >= 37 && key <= 40)) {
    			switch (event.keyCode) {
    				case 33: // pg up
    				case 37: // left
    				case 38: // up
    					this.prev();
    					break;
    				case 9:  // tab
    				case 32: // space
    				case 34: // pg down
    				case 39: // right
    				case 40: // down
    					this.next();
    					break;
    			}
    			event.preventDefault();
    		}
    		//out("__onKeyup", key);
    	},

    	//-------------------------
    	// HASH 이벤트
    	//-------------------------

    	// last hash detected
    	__lastHash: null,

        // When the step is entered hash in the location is updated
        // (just few lines above from here), so the hash change is 
        // triggered and we would call `goto` again on the same element.
    	__onHashchange: function () {
    		// To avoid this we store last entered hash and compare.
    		if (window.location.hash !== this.__lastHash) {
    			this.goto(this._getElementFromHash());
    		}
    		//out("__onHashchange", this.__lastHash);
    	},

        // returns an element located by id from hash part of window location.
        // get id from url # by removing `#` or `#/` from the beginning,
        // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
    	_getElementFromHash: function () {
    		var id = window.location.hash.replace(/^#\/?/, "");
    		return document.getElementById(id);
    	},

    	///////////////////////////
    	// Click 이벤트
    	///////////////////////////

    	__onClick: function(event){
    	    out("click");
    	    var target = event.target;
    	    // find closest step element that is not active
    	    while (true) {
    	        if (target === document.documentElement) return;

    	        //-------------------------
    	        // 바로 윗단계로 이동
    	        //-------------------------

    	        if (target === this.screen) {
    	            var success = link_up.apply(this, [this.activeStep]);
    	            if (success) event.preventDefault();
    	            return;
    	        }

    	        //-------------------------
    	        // step 링크를 클릭한 경우
    	        //-------------------------

    	        if (target.tagName === "A") {
    	            // #/ID 인 경우는 hash에 의한 일반 링크이므로 
    	            // 여기에서는 #ID로 링크건 경우만 처리
    	            var href = target.getAttribute("href");
    	            if (href && href[0] === '#' && href[1] !== '/') {
    	                var success = link_id.apply(this, [href]);
    	                if (success) {
    	                    event.stopImmediatePropagation();
    	                    event.preventDefault();
    	                }
    	            }
    	            return;
    	        }

    	        //-------------------------
    	        // step elements를 클릭한 경우
    	        //-------------------------

    	        if (target.classList.contains("active")) break;
    	        if (target.classList.contains("u-document")) break;
    	        target = target.parentNode;
    	    }

    	    var success = link_element.apply(this, [target]);
    	    if (success) event.preventDefault();

    	    //-------------------------
    	    // 링크 함수
    	    //-------------------------

    		function link_id(hash) {
    			var id = document.getElementById(hash.slice(1));
    			var success = this.goto(id);
    			return success;
    		}

    		function link_up(hash) {
    			out("# TODO : 한단계 위 문서로 포커싱을 이동 시킨다.");
    			var success = this.goto("overview");
    			return success;
    		}

    		function link_element(el) {
    			var success = this.goto(el);
    			return success;
    		}
    	},
		
    	//-------------------------
    	// Touch 이벤트
    	//-------------------------

    	// touch handler to detect taps on the left and right side of the screen
    	// based on awesome work of @hakimel: https://github.com/hakimel/reveal.js
    	__onTouch: function (event) {

    	    if (event.touches.length === 1) {
    	        var x = event.touches[0].clientX;
    	        var width = window.innerWidth * 0.3;
    	        var success = null;

    	        if (x < width) {
    	            success = this.prev();
    	        } else if (x > window.innerWidth - width) {
    	            success = this.next();
    	        }

    	        if (success) {
    	            event.preventDefault();
    	        }
    	    }
    	}

		///////////////////////////
		// END PROTOTYPE
		///////////////////////////
    };

    ////////////////////////////////////////////////////////
    //
    // API 인스턴스
    //
    ////////////////////////////////////////////////////////

    var __API = {};
    function API(screenID, value) {
        // GET
        if (value === undefined) {
            return __API["impress-root-" + screenID];
        }
        // SET
        __API["impress-root-" + screenID] = value;
    }

	//-------------------------
	// 기능 확장때 사용하기 위해 함수 원형 참조
	//-------------------------

    window._Space = Space;
	/*
	// case 01 : 다음과 같이 확장시킴
    window._Space.prototype.aaa = function () {
    	out("aaa");
    }
	
	// case 02 : Space 객체 상속인 경우
    var _superClass = window._Space;
    var _super_prototype = _superClass.prototype;
    ExtendedViewer.prototype = $.extend({}, _super_prototype, getProto());
    window._Space = ExtendedViewer;

    function ExtendedViewer() {
    	_superClass.apply(this, arguments);
    }

    function getProto() {
    	return {
    		method: function () {
    			out("New Method");
    		},
    		init: function (data) {
    			out("Override");
    			//window._Space
    			_super_prototype.init.apply(this, arguments);
    		}
    	}
    }
	*/

	//-------------------------
	// API 캡슐화
	//-------------------------

    window.Space = function (screenID) {

    	screenID = screenID || "u-screen";

    	// 이미 초기화된 screen가 있으면 바로 API를 리턴한다.
    	var api = API(screenID);
    	if (api) return api;

		// api 객체 생성
    	var instance = new window._Space(screenID);
    	api = {
    		// 테스트용으로 노출시킴
    		app: instance,

            init: factory(instance.init),
            goto: factory(instance.goto),
            next: factory(instance.next),
        	prev: factory(instance.prev),
        };

        function factory(func) {
            return function () {
                func.apply(instance, arguments)
            }
        }

		// 생성된 api는 등록해 놓음
        API(screenID, api);
        return api;
    };


})(document, window);



