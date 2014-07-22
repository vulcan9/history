
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
var pfx = (function () {

	var style = document.createElement('dummy').style;
	var prefixes = 'Webkit Moz O ms Khtml'.split(' ');
	var memory = {};

	return function (prop) {
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

		return memory[prop];
	};

})();

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
// CORE
//===============================================================

(function ( document, window ) {

    function ext(screenID) {

    	// Check Support
    	if (SVG.supported == false) {
    		alert('SVG not supported');
    		return;
    	}

        // screen element ID
    	this.screenID = screenID || "u-screen";
    	out("# API SCREEN ID : ", screenID);

        this.initialized = false;
    }

    ext.prototype = {
    	screen: null,
    	viewport:null,
    	canvas: null,
    	document: null,

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


    		/*
			// SVG 테스트 코드 - 일정 크기 이상이 되면 브라우져가 하얗게 변해버림
    		// (svg) root document를 생성한다.
            var svg = SVG("u-canvas").attr("id", "u-svg")
				.fixSubPixelOffset()
				.size($canvas.width(), $canvas.height());

    		// DOM svg
            var $svg = $canvas.find("#u-svg");
            this.svg = $svg[0];
            this.svg.classList.add("u-svg");
			*/
            out("# DOM : ", this.screen);

    		//-------------------------
    		// 화면 업데이트
    		//-------------------------








            var $svg = $("<div>")
				.attr("id", "u-svg")
				.css({ width: $canvas.width(), height: $canvas.height() })
				.addClass("u-svg");
            $canvas.append($svg);
            this.svg = $svg[0];

            $svg.text("일정 크기 이상이되면 이상해질수도 있을듯...");



            var self = this;




			/*
			
            var w = 1000, h = 800;
            var group = createGroup(svg, 200, 200);//.translate(50, 50);
            var rect = createElement(group, "rect").fill("#FF0").size(100, 100);
            var rect = createElement(group, "rect").fill("#F00").move(100, 100);

            function createGroup(parentGroup, w, h) {
            	var group = parentGroup.group().addClass("gArea")
            	group.rect().addClass("background")
					//.stroke({ color: '#f06', width: 1, opacity: 0.5 })
					//.size(w-1, h-1).move(0.5, 0.5);
					.size(w, h);

            	// 마우스 이벤트
            	group.on("click", function (e) {
            		if (e.defaultPrevented) return;
            		e.preventDefault();
            		out("# Element 클릭 : ", this);
            		self.currentDocument = this;
            		self.goto();
            	});

            	return group;
            }

            function createElement(parent, type) {
            	var el = parent[type]().size(50, 50).fill("#F00");
            	
            	// 마우스 이벤트
            	el.on("click", function (e) {
            		if (e.defaultPrevented) return;
            		e.preventDefault();
            		out("# Element 클릭 : ", this);
            		self.currentDocument = this;
            		self.goto();
            	});

            	return el;
            }

            
            this.svg.addEventListener("click", function (e) {
            	if (e.defaultPrevented) return;
            	e.preventDefault();
            	out("# Element 클릭 : ", this);
            	self.currentDocument = this;
            	self.goto();
            }, false);
			*/










            this.currentDocument = this.svg;
            this.goto();

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






    	goto: function () {
    		out("initScale : ", this.screen);

    		//-------------------------
    		// SCALE 설정
    		//-------------------------

    		var win = this.screen;
    		var doc = this.currentDocument;

    		// scale factor 계산하기
    		var config = this._getGeomatry(doc);
    		

    		this.windowScale = this._computeScreenScale(win, config);
    		out("this.windowScale : ", this.windowScale);

    		//-------------------------
    		// canvas state
    		//-------------------------


			/*
			보여지는 screen 크기는 고정이다
			scale 변환과 나머지 transition은 분리해서 실행한다.
			scale은 결국 svg가 크거나 작게 표시될 수 있는 객체에게 적용되어야 한다.
			전환은 svg 위치 자체를 이동시켜주어야 한다.
			--> svg객체와는 상관이 없을듯 하다.
			*/

			/*
    		svg가 축소/확대 되어야 한다
    		svg가 이동 되어야 한다.
			screen은 항상 크기를 유지해야 한다.

			scale은 screen크기와 svg내부 선택된 객체의 크기에의해 결정된다.
			move는 svg내부의 선택된 객체의 좌표로 결정된다.
			rotation은 svg 내부의 선택된 객체의 회전에 의해 결정된다.

			transition은 svg의 matrix 연산이 아닌 div에 css 적용하는 것으로 실행한다.
			*/

    		// compute target state of the canvas based on given step
    		var target = {
    			rotate: {
    				x: 0,
    				y: 0,
    				z: 0
    			},
    			translate: {
    				x: 0,
    				y: 0,
    				z: 0
    			},
    			scale: 1 / 1
    		};


    		var targetScale = target.scale * this.windowScale;
    		targetScale = Math.floor(targetScale * 100) / 100;
    		out("targetScale : ", targetScale);

    		//-------------------------
    		// transition 적용 - screen, canvas --------> 수정 필요
    		//-------------------------

    		var duration = 500;
    		var zoomin = true;

    		duration = toNumber(duration, config.transitionDuration);
    		var delay = (duration / 2);

    		// screen : scale 을 조정한다.
    		// canvas : translate, rotation 제어
    		// root와 canvas는 각각 다른 delay 시간을 가지고 개별적으로 transition이 시작된다. (자연스러운 효과를 위한것임)
    		// 때문에 두개의 transition이 언제 끝났는지알 필요가 있다.

			/*
    		css(this.screen, {
    			// to keep the perspective look similar for different scales
    			// we need to 'scale' the perspective, too
    			transform: perspective(config.perspective / targetScale) + scale(targetScale),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? delay : 0) + "ms"
    		});

    		css(this.canvas, {
    			transform: rotate(target.rotate, true) + translate(target.translate),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? 0 : delay) + "ms"
    		});
			*/
    		css(this.viewport, {
    			// to keep the perspective look similar for different scales
    			// we need to 'scale' the perspective, too
    			transform: perspective(config.perspective / targetScale) + scale(targetScale),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? delay : 0) + "ms"
    		});
    		css(this.canvas, {
    			transform: rotate(target.rotate, true) + translate(target.translate),
    			transitionDuration: duration + "ms",
    			transitionDelay: (zoomin ? 0 : delay) + "ms"
    		});
			
			// 항상 중앙에 위치





    	},

    	//===============================================================
    	// scale
    	//===============================================================

		// 활성화 문서 객체의 정보를 얻음
    	_getGeomatry: function (svgElement) {
    		var w, h;
    		if (svgElement.bbox) {
    			var box = svgElement.bbox();
    			w = box.width;
    			h = box.height;
    		} else {
    			w = $(svgElement).width();
    			h = $(svgElement).height();
    		}

    		var config = {
    			width: w,
    			height: h,
    			maxScale: 10,
    			minScale: 0,
    			perspective: 1000,
    			transitionDuration: 1000
    		};
    		return config;
    	},

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












    };

	//===============================================================
	// API
	//===============================================================

    // 이미 초기화된 screen가 있으면 바로 API를 리턴한다.
    window.ext = function (screenID) {

    	var instance = new ext(screenID);
        var API = {
            init: factory(instance.init),
            goto: factory(instance.goto),
            //next: factory(instance.next),
        	//prev: factory(instance.prev),
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

        return API;
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






































