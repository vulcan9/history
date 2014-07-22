
function out() {
	console.log.apply(console, arguments);
}

//-------------------------
// CSS
//-------------------------

// element에 props Object의 값으로 style을 설정한다.
// 모든 속성 이름은 pfx 함수를 통해 버전에 따른 올바른 접두어를 사용할수 있도록 바뀐다.
function css(el, props) {
	var key, pkey;
	for (key in props) {
		if (props.hasOwnProperty(key)) {
			pkey = pfx(key);
			if (pkey !== null) {
				el.style[pkey] = props[key];
			}
		}
	}
	return el;
};

// 매개 변수로 표준 CSS 속성 이름을 받아 내부적으로 실행하여
// 브라우저에서 사용할 수 있는 유효한 prefixed version의 이름을 반환하는 
// 함수를 리턴해줌
// The code is heavily inspired by Modernizr http://www.modernizr.com/
function pfx(prop) {
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
};

//-------------------------
// Transition
//-------------------------

function translate(t) {
	return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
};

// By default the rotations are in X Y Z order that can be reverted by passing `true` as second parameter.
function rotate(r, revert) {
	var rX = " rotateX(" + r.x + "deg) ";
	var rY = " rotateY(" + r.y + "deg) ";
	var rZ = " rotateZ(" + r.z + "deg) ";

	return revert ? rZ + rY + rX : rX + rY + rZ;
};

function scale(s) {
	return " scale(" + s + ") ";
};

// `perspective` builds a perspective transform string for given data.
function perspective(p) {
	return " perspective(" + p + "px) ";
};

//===============================================================
// CHECK SUPPORT
//===============================================================
					  
function checkSupport() {
	var ua = navigator.userAgent.toLowerCase();

	// browser should support CSS 3D transtorms 
	var support = (pfx("perspective") !== null) &&
					// classList, dataset HTML5 API가 지원되는지 확인
					(document.body.classList) && (document.body.dataset) &&

					// but some mobile devices need to be blacklisted,
					// because their CSS 3D support or hardware is not
					// good enough to run impress.js properly, sorry...
					(ua.search(/(iphone)|(ipod)|(android)/) === -1);
	return support;
}

//===============================================================
// CORE
//===============================================================





// 임의의 데이터로 구성해 본다.

var documents = [
	'<div id="overview" class="step" data-x="-3000" data-y="-1500" data-scale="10"></div>',
	'<div id="bored" class="step slide" data-x="-1000" data-y="-1500"><q>Arent you just <b>bored</b> with all those slides-based presentations?</q></div>',
	'<div class="step slide" data-x="0" data-y="-1500"><q>Dont you think that presentations given <strong>in modern browsers</strong> shouldnt <strong>copy the limits</strong> of classic slide decks?</q></div>',
	'<div class="step slide" data-x="-4000" data-y="-4500" data-scale="2"><q>Would you like to <strong>impress your audience</strong> with <strong>stunning visualization</strong> of your talk?</q></div>'
];




(function ( document, window ) {

    function ext(screenID) {

    	//-------------------------
    	// support 브라우져 체크
    	//-------------------------

    	var impressSupported = checkSupport();
    	
    	if (!impressSupported) {
    		alert("Not Support CSS");
    	}

    	//-------------------------
    	// 인스턴스
    	//-------------------------

        // screen element ID
    	this.screenID = screenID || "u-screen";
    	out("# API SCREEN ID : ", screenID);

        this.initialized = false;
    }

    ext.prototype = {
    	screen: null,
    	viewport:null,
    	canvas: null,
    	//document: null,
		
    	// steps 데이터 (transition 정보를 저장)
    	stepsData: {},

    	// 현재 활성화 상태의 (active step) element
    	activeStep: null,
    	// current state (position, rotation and scale) of the presentation
    	currentState: null,
    	
    	init: function () {

    		if (this.initialized) return;

    		//-------------------------
    		// DOM 구조 설정
    		//-------------------------

    		// DOM screen
    		var $screen = $("#" + this.screenID)
				.addClass("u-screen");
    		this.screen = $screen[0];
            
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

    		out("# DOM : ", this.screen);

    		//-------------------------
    		// 설정값(congig) 초기화 설정
    		//-------------------------

    		// 설정값 초기화
    		var rootData = this.viewport.dataset;
    		var defaults = this.defaults;
    		this.config = {
    			width:              toNumber(rootData.width, defaults.width),
    			height:             toNumber(rootData.height, defaults.height),
    			maxScale:           toNumber(rootData.maxScale, defaults.maxScale),
    			minScale:           toNumber(rootData.minScale, defaults.minScale),
    			perspective:        toNumber(rootData.perspective, defaults.perspective),
    			transitionDuration: toNumber(rootData.transitionDuration, defaults.transitionDuration)
    		};

    		// scale factor 계산하기
    		var win = this.screen;
    		this.windowScale = this._computeScreenScale(win, this.config);
    		out("this.windowScale : ", this.windowScale);

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
    		css(this.viewport, rootStyles);
    		css(this.viewport, {
    			top:       "50%",
    			left:      "50%",
    			transform: perspective(this.config.perspective / this.windowScale) + scale(this.windowScale)
    		});

    		// canvas
    		css(this.canvas, rootStyles);

    		//-------------------------
    		// canvas DOM 생성 (documents 데이터)
    		//-------------------------

    		// "canvas" element로 모두 생성. (wrap steps)
    		var len = documents.length;
    		var html = "";
    		for (var i = 0; i < len; ++i){
    			html += documents[i];
    		}
    		this.canvas.innerHTML = html;

    		//-------------------------
    		// canvas DOM Style
    		//-------------------------
    		var self = this;
    		var childNodes = arrayify(this.canvas.childNodes);
    		//childNodes.forEach(initStep);
    		childNodes.forEach.apply(
				childNodes, [function () {
					initStep.apply(self, arguments);
				}]);

    		// data- attribute에 설정된 data로 step element를 초기화 시키고 style을 수정한다.
    		var self = this;
    		function initStep(el, idx) {

    			// transition 데이터 구성
    			var data = el.dataset;
    			var step_data = {
    				translate: {
    					x: toNumber(data.x),
    					y: toNumber(data.y),
    					z: toNumber(data.z)
    				},
    				rotate: {
    					x: toNumber(data.rotateX),
    					y: toNumber(data.rotateY),
    					z: toNumber(data.rotateZ || data.rotate)
    				},
    				scale: toNumber(data.scale, 1),
    				el: el
    			};

    			// id가 설정되어 있지 않으면 "step-N"으로 설정해 준다.
    			if (!el.id) {
    				el.id = "step-" + (idx + 1);
    			}

    			console.log("// impress-ID 로 된 stepsData key를 수정");

    			// stepsData에 기록해 놓음
    			this.stepsData["impress-" + el.id] = step_data;

    			// element에 CSS 적용
    			css(el, {
    				position: "absolute",
    				transform: "translate(-50%,-50%)" +
                               translate(step_data.translate) +
                               rotate(step_data.rotate) +
                               scale(step_data.scale),
    				transformStyle: "preserve-3d"
    			});
    		};

    		//-------------------------
    		// currentState 초기화
    		//-------------------------

    		// set a default initial state of the canvas
    		this.currentState = {
    			translate: { x: 0, y: 0, z: 0 },
    			rotate: { x: 0, y: 0, z: 0 },
    			scale: 1
    		};

    		//-------------------------
    		// 초기화 종료
    		//-------------------------

    		initialized = true;
    		var api = API["impress-root-" + this.screenID];
    		this.triggerEvent(this.viewport, "impress:init", { api: api });

    		//-------------------------
    		// 윈도우 리사이징
    		//-------------------------

            window.addEventListener(
				"resize",
				throttle(function () {
						// 현재 활성화 문서에서 goto를 통해 화면 업데이트 실행
						this.goto();
					}, 250, this),
				false
			);

    	},

    	// trasition 설정값
    	config: null,
    	// trasition (default) 설정값
    	defaults: {
    		width: 1024,
    		height: 768,
    		maxScale: 1,
    		minScale: 0,
    		perspective: 1000,
    		transitionDuration: 1000
    	},

    	// scale factor of the browser window
    	windowScale:null,
		
    	// used to reset timeout for `impress:stepenter` event
    	stepEnterTimeout: null,
		
    	// parameter에 해당하는 step element 를 반환한다.
    	// number 이면 index로 찾는다.
    	// string 이면 id 로 찾는다
    	// DOM element 이면 올바른 step element 인지 확인 후 리턴
    	_getStep: function (step) {
			/*
    		if (typeof step === "number") {
    			step = step < 0 ? steps[steps.length + step] : steps[step];
    		} else if (typeof step === "string") {
    			step = byId(step);
    		}
    		return (step && step.id && stepsData["impress-" + step.id]) ? step : null;
			*/
    		if (typeof step === "string") {
    			step = document.getElementById(step);
    		}
    		return (step && step.id && this.stepsData["impress-" + step.id]) ? step : null;
    	},

    	// el : index (number), id (string) or element (dom Element)
    	// duration : second (optionally)
    	goto: function (el, duration) {

    		if (!initialized || !(el = this._getStep(el))) {
    			return false;
    		}

    		// 키보드 등의 동작으로 가끔 브라우져가 페이지를 스크롤 하는 현상을 임시로 해결해 놓은 코드임.
    		window.scrollTo(0, 0);

    		//-------------------------
    		// canvas state
    		//-------------------------

    		var step = this.stepsData["impress-" + el.id];

    		// compute target state of the canvas based on given step
    		var target = {
    			rotate: {
    				x: -step.rotate.x,
    				y: -step.rotate.y,
    				z: -step.rotate.z
    			},
    			translate: {
    				x: -step.translate.x,
    				y: -step.translate.y,
    				z: -step.translate.z
    			},
    			scale: 1 / step.scale
    		};

    		//-------------------------
    		// zoom in or out 여부에 따라 transition 순서를 조절해야 한다.
    		//-------------------------

    		// transition 이 zoom in 또는 zoom out인지를 판별한다.
    		// zoom in 경우 : move, rotate transition 을 시작한 후(delay) scaling을 시도한다.
    		// zoom out 경우 : scaling down 후(delay) move, rotate 를 시도한다.
    		var zoomin = target.scale >= this.currentState.scale;

    		duration = toNumber(duration, this.config.transitionDuration);
    		var delay = (duration / 2);

    		//-------------------------
    		// scale 계산
    		//-------------------------

    		// 같은 step 이 다시 선택된 상태 이더라도 windowScale을 다시 계산한다.
    		// (woindow 창 크기 조정에 의해 발생될 가능성이 있기 때문에)
    		if (el === this.activeStep) {
    			this.windowScale = this._computeWindowScale(this.config);
    		}

    		var targetScale = target.scale * this.windowScale;

    		//-------------------------
    		// onStepLeave 이벤트
    		//-------------------------

			/*
    		// trigger leave of currently active element (if it's not the same step again)
    		if (this.activeStep && this.activeStep !== el) {
    			onStepLeave(this.activeStep);
    		}
			*/

    		//-------------------------
    		// transition 적용 - viewport, canvas
    		//-------------------------

    		// viewport : scale 을 조정한다.
    		// canvas : translate, rotation 제어
    		// root와 canvas는 각각 다른 delay 시간을 가지고 개별적으로 transition이 시작된다. (자연스러운 효과를 위한것임)
    		// 때문에 두개의 transition이 언제 끝났는지알 필요가 있다.

    		css(this.viewport, {
    			// to keep the perspective look similar for different scales
    			// we need to 'scale' the perspective, too
    			transform: perspective(this.config.perspective / targetScale) + scale(targetScale),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? delay : 0) + "ms"
    		});

    		css(this.canvas, {
    			transform: rotate(target.rotate, true) + translate(target.translate),
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
    		// 기록
    		//-------------------------

    		// store current state
    		this.currentState = target;
    		this.activeStep = el;

    		//-------------------------
    		// onStepEnter 이벤트
    		//-------------------------

    		// And here is where we trigger `impress:stepenter` event.
    		// We simply set up a timeout to fire it taking transition duration (and possible delay) into account.
    		// If you want learn something interesting and see how it was done with `transitionend` go back to
    		// version 0.5.2 of impress.js: http://github.com/bartaz/impress.js/blob/0.5.2/js/impress.js

			/*
    		// 2개의 transition 종료 시점에 이벤트 발생시킴
    		window.clearTimeout(this.stepEnterTimeout);
    		this.stepEnterTimeout = window.setTimeout(function () {
    			onStepEnter(this.activeStep);
    		}, duration + delay);
			*/

    		return el;
    	},
		
    	///////////////////////////
    	// prev, next
    	///////////////////////////

    	// `prev` API function goes to previous step (in document order)
    	prev: function () {
    		var steps = arrayify(this.canvas.childNodes);

    		var prev = steps.indexOf(this.activeStep) - 1;
    		prev = prev >= 0 ? steps[prev] : steps[steps.length - 1];

    		return this.goto(prev);
    	},

		// `next` API function goes to next step (in document order)
    	next: function () {
    		var steps = arrayify(this.canvas.childNodes);

    		var next = steps.indexOf(this.activeStep) + 1;
			next = next < steps.length ? steps[next] : steps[0];

			return this.goto(next);
		},

    	//===============================================================
    	// scale
    	//===============================================================

    	// scale factor : 설정된 값과 window 크기 사이에서 scale factor을 연산
    	_computeScreenScale: function (canvas, config) {
    		var $win = $(canvas);
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

        // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
        // and triggers it on element given as `el`.
    	triggerEvent: function (el, eventName, detail) {
    	    var event = document.createEvent("CustomEvent");
    	    event.initCustomEvent(eventName, true, true, detail);
    	    el.dispatchEvent(event);
    	},












    };

	//===============================================================
	// API
	//===============================================================

    var API = {};

    // 이미 초기화된 screen가 있으면 바로 API를 리턴한다.
    window.ext = function (screenID) {

    	var instance = new ext(screenID);
        var api = {
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

		//**********************************
		// 테스트용으로 노출시킴

        window.app = instance;

    	//**********************************

        API["impress-root-" + screenID] = api;
        return api;
    };

})(document, window);



// TODO : scale factor 계산하기

// TODO : HASH

// TODO : Transition 기능
























//===============================================================
// HELPER
//===============================================================

// 숫자화 (fallback : 숫자 변환 실패시 반환값)
function toNumber(numeric, fallback) {
	return isNaN(numeric) ? (fallback || 0) : Number(numeric);
};

// `arraify` takes an array-like object and turns it into real Array to make all the Array.prototype goodness available.
function arrayify(a) {
	return [].slice.call(a);
};


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



//-------------------------
// DOM
//-------------------------






































