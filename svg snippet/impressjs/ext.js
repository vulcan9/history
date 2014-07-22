(function ( document, window ) {
    'use strict';
     
    // http://regebro.github.io/hovercraft
    // http://bartaz.github.io/meetjs/css3d-summit/#/support

	//===============================================================
	// HELPER FUNCTIONS
	//===============================================================

    //-------------------------
    // DOM
    //-------------------------

	// id로 element 찾기
    function byId(id) {
		return document.getElementById(id);
	};

    // `$` returns first element for given CSS `selector` in the `context` of the given element or whole document.
	function $(selector, context) {
	    context = context || document;
	    return context.querySelector(selector);
	};

    // `$$` return an array of elements for given CSS `selector` in the `context` of the given element or whole document.
	function $$(selector, context) {
	    context = context || document;
	    return arrayify(context.querySelectorAll(selector));
	};

    // `triggerEvent` builds a custom DOM event with given `eventName` and `detail` data
    // and triggers it on element given as `el`.
	function triggerEvent(el, eventName, detail) {
	    var event = document.createEvent("CustomEvent");
	    event.initCustomEvent(eventName, true, true, detail);
	    el.dispatchEvent(event);
	};

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
					el.style[pkey]= props[key];
				}
			}
		}
		return el;
	};

    // 매개 변수로 표준 CSS 속성 이름을 받아 내부적으로 실행하여
    // 브라우저에서 사용할 수 있는 유효한 prefixed version의 이름을 반환하는 
	// 함수를 리턴해줌
	// The code is heavily inspired by Modernizr http://www.modernizr.com/
	/*
	var pfx = (function () {

	    var style = document.createElement('dummy').style;
	    var prefixes = 'Webkit Moz O ms Khtml'.split(' ');
	    var memory = {};

	    return 

	})();
	*/

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

    //-------------------------
    // Utils
    //-------------------------

    // 숫자화 (fallback : 숫자 변환 실패시 반환값)
	function toNumber(numeric, fallback) {
	    return isNaN(numeric) ? (fallback || 0) : Number(numeric);
	};

    // `arraify` takes an array-like object and turns it into real Array to make all the Array.prototype goodness available.
	function arrayify(a) {
	    return [].slice.call(a);
	};

    // scale factor : 설정된 값과 window 크기 사이에서 scale factor을 연산
	function computeWindowScale(config) {
	    var hScale = window.innerHeight / config.height;
	    var wScale = window.innerWidth / config.width;
	    var scale = hScale > wScale ? wScale : hScale;

	    if (config.maxScale && scale > config.maxScale) {
	        scale = config.maxScale;
	    }

	    if (config.minScale && scale < config.minScale) {
	        scale = config.minScale;
	    }

	    return scale;
	};

	//===============================================================
	// GLOBALS AND DEFAULTS
	//===============================================================

	// root elements of all impress.js instances
	// 한개 이상의 instance를 생성할 수 있지만 그것이 어떤 의미가 있을지 모르겠다.
	// 어쨌든  인스턴스를 저장한다.
	var roots = {};

    // default 설정값
	var defaults = {
	    width: 1024,
	    height: 768,
	    maxScale: 1,
	    minScale: 0,

	    perspective: 1000,

	    transitionDuration: 1000
	};


	var body = document.body;
    // el.classList (HTML5) : http://romeoh.blog.me/140171661063
    // el.dataset (HTML5) : http://www.sitepoint.com/managing-custom-data-html5-dataset-api/

    //===============================================================
    // CHECK SUPPORT
    //===============================================================

	var ua = navigator.userAgent.toLowerCase();
	var impressSupported =
                          // browser should support CSS 3D transtorms 
                          (pfx("perspective") !== null) &&

                          // classList, dataset HTML5 API가 지원되는지 확인
                          (body.classList) && (body.dataset) &&

                          // but some mobile devices need to be blacklisted,
                          // because their CSS 3D support or hardware is not
                          // good enough to run impress.js properly, sorry...
                          (ua.search(/(iphone)|(ipod)|(android)/) === -1);

    //===============================================================
    // IMPRESS.JS API
	//===============================================================

	// rootId로 지정된 element가 root로 지정되어 프레젠테이션이 진행된다.
	// default = 'impress'

	var ext = window.ext = function (rootId) {

	    //-------------------------
	    // support 브라우져 체크
	    //-------------------------

	    // it's just an empty function ... and a useless comment.
	    var empty = function () { return false; };
	    if (!impressSupported) {
	        return {
	            init: empty,
	            goto: empty,
	            prev: empty,
	            next: empty
	        };
	    }

	    //-------------------------
	    // 인스턴스
	    //-------------------------

	    // root element ID
	    rootId = rootId || "impress";

	    // 이미 초기화된 root가 있으면 바로 API를 리턴한다.
	    if (roots["impress-root-" + rootId]) {
	        return roots["impress-root-" + rootId];
	    }

	    //-------------------------
	    // 변수 초기화
	    //-------------------------

	    // presentation steps 데이터 (transition 정보를 저장)
	    var stepsData = {};
	    // step elements 배열
	    var steps = null;

	    // 현재 활성화 상태의 (active step) element
	    var activeStep = null;
	    // current state (position, rotation and scale) of the presentation
	    var currentState = null;

	    // trasition 설정값
	    var config = null;
	    // scale factor of the browser window
	    var windowScale = null;

// root presentation elements
var root = byId(rootId);
var canvas = document.createElement("div");

	    var initialized = false;












	    ////////////////////////////////////////////////////////
	    // EVENT
	    ////////////////////////////////////////////////////////


console.log("// 이벤트 분리 시키기");

	    //-------------------------
	    // STEP EVENTS - 2가지
	    //-------------------------

	    // impress:stepenter : step이 screen에 보여질때 (이전 step으로부터 transition이 끝났을때)
	    // impress:stepleave : step is left (다음 step의 transition이 시작될때).

	    // reference to last entered step
	    var lastEntered = null;

	    // step이 활성화(entered)될때 호출됨
	    // 이벤트는 lastEntered 와 다를때만 trigger됨.
	    var onStepEnter = function (step) {
	        if (lastEntered !== step) {
	            triggerEvent(step, "impress:stepenter");
	            lastEntered = step;
	        }
	    };

	    // `onStepLeave` is called whenever the step element is left
	    // 이벤트는 lastEntered 와 같을때만 trigger됨.
	    var onStepLeave = function (step) {
	        if (lastEntered === step) {
	            triggerEvent(step, "impress:stepleave");
	            lastEntered = null;
	        }
	    };

	    ////////////////////////////////////////////////////////
	    // API
	    ////////////////////////////////////////////////////////


console.log("// 메서드 분리 시키기");


	    ///////////////////////////
	    // init
	    ///////////////////////////

	    var init = function () {
	        if (initialized) { return; }

            
	        //-------------------------
	        // META 태그
	        //-------------------------

	        // <meta> Tag: 모바일 디바이스를 위해 viewport 세팅
	        var meta = $("meta[name='viewport']") || document.createElement("meta");
	        meta.content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no";
	        if (meta.parentNode !== document.head) {
	            meta.name = 'viewport';
	            document.head.appendChild(meta);
	        }

	        //-------------------------
	        // 설정값(congig) 초기화 설정
	        //-------------------------

	        // 설정값 초기화
	        var rootData = root.dataset;
	        config = {
	            width:                toNumber(rootData.width, defaults.width),
	            height:               toNumber(rootData.height, defaults.height),
	            maxScale:             toNumber(rootData.maxScale, defaults.maxScale),
	            minScale:             toNumber(rootData.minScale, defaults.minScale),
	            perspective:          toNumber(rootData.perspective, defaults.perspective),
	            transitionDuration:   toNumber(rootData.transitionDuration, defaults.transitionDuration)
	        };

            // scale factor 계산하기
	        windowScale = computeWindowScale(config);

	        //-------------------------
	        // DOM 설정
	        //-------------------------

	        // root (roorID를 가진 element)의 모든 자식 element를 
	        // "canvas" element로 모두 이동시킨다. (wrap steps)
	        var childNodes = arrayify(root.childNodes);
	        childNodes.forEach(function (el) {
	            canvas.appendChild(el);
	        });
	        root.appendChild(canvas);

	        //-------------------------
	        // DOM Style 초기화 설정
	        //-------------------------

	        // html
	        // (document.documentElement : <html> element)
	        document.documentElement.style.height = "100%";

            // body
	        css(body, {
	            height: "100%",
	            overflow: "hidden"
	        });

            // root
	        var rootStyles = {
	            position: "absolute",
	            transformOrigin: "top left",
	            transition: "all 0s ease-in-out",
	            transformStyle: "preserve-3d"
	        };

	        css(root, rootStyles);
	        css(root, {
	            top: "50%",
	            left: "50%",
	            transform: perspective(config.perspective / windowScale) + scale(windowScale)
	        });

            // canvas
	        css(canvas, rootStyles);

            // body 클래스 변경
	        body.classList.remove("impress-disabled");
	        body.classList.add("impress-enabled");

	        //-------------------------
	        // Step 목록 초기화
	        //-------------------------

	        // get and init steps
	        steps = $$(".step", root);
	        steps.forEach(initStep);

	        // data- attribute에 설정된 data로 step element를 초기화 시키고 style을 수정한다.
	        // steps 배열의 element들에 대하여 실행됨 (idx는 배열에서 순서)
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
	            stepsData["impress-" + el.id] = step_data;

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
	        currentState = {
	            translate: { x: 0, y: 0, z: 0 },
	            rotate: { x: 0, y: 0, z: 0 },
	            scale: 1
	        };

	        //-------------------------
	        // 초기화 종료
	        //-------------------------

	        initialized = true;
	        triggerEvent(root, "impress:init", { api: roots["impress-root-" + rootId] });
	    };



	    ///////////////////////////
	    // goto
	    ///////////////////////////

	    // used to reset timeout for `impress:stepenter` event
	    var stepEnterTimeout = null;

	    // el : index (number), id (string) or element (dom Element)
	    // duration : second (optionally)
	    var goto = function (el, duration) {

	        if (!initialized || !(el = getStep(el))) {
	            return false;
	        }

            // 키보드 등의 동작으로 가끔 브라우져가 페이지를 스크롤 하는 현상을 임시로 해결해 놓은 코드임.
	        window.scrollTo(0, 0);

	        //-------------------------
	        // step element
	        //-------------------------

	        var step = stepsData["impress-" + el.id];

            // 활성화 step 정보 수정
	        if (activeStep) {
	            activeStep.classList.remove("active");
	            body.classList.remove("impress-on-" + activeStep.id);
	        }
	        el.classList.add("active");
	        body.classList.add("impress-on-" + el.id);

	        //-------------------------
	        // canvas state
	        //-------------------------

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
	        var zoomin = target.scale >= currentState.scale;

	        duration = toNumber(duration, config.transitionDuration);
	        var delay = (duration / 2);

	        //-------------------------
	        // scale 계산
	        //-------------------------

	        // 같은 step 이 다시 선택된 상태 이더라도 windowScale을 다시 계산한다.
	        // (woindow 창 크기 조정에 의해 발생될 가능성이 있기 때문에)
	        if (el === activeStep) {
	            windowScale = computeWindowScale(config);
	        }

	        var targetScale = target.scale * windowScale;

	        //-------------------------
	        // onStepLeave 이벤트
	        //-------------------------

	        // trigger leave of currently active element (if it's not the same step again)
	        if (activeStep && activeStep !== el) {
	            onStepLeave(activeStep);
	        }

	        //-------------------------
	        // transition 적용 - root, canvas
	        //-------------------------

	        // root : scale 을 조정한다.
	        // canvas : translate, rotation 제어
	        // root와 canvas는 각각 다른 delay 시간을 가지고 개별적으로 transition이 시작된다. (자연스러운 효과를 위한것임)
	        // 때문에 두개의 transition이 언제 끝났는지알 필요가 있다.

	        css(root, {
	            // to keep the perspective look similar for different scales
	            // we need to 'scale' the perspective, too
	            transform: perspective(config.perspective / targetScale) + scale(targetScale),
	            transitionDuration: duration + "ms",
	            transitionDelay: (zoomin ? delay : 0) + "ms"
	        });

	        css(canvas, {
	            transform: rotate(target.rotate, true) + translate(target.translate),
	            transitionDuration: duration + "ms",
	            transitionDelay: (zoomin ? 0 : delay) + "ms"
	        });

	        //-------------------------
	        // Here is a tricky part...
	        //-------------------------

	        // If there is no change in scale or no change in rotation and translation, it means there was actually
	        // no delay - because there was no transition on `root` or `canvas` elements.
	        // We want to trigger `impress:stepenter` event in the correct moment, so here we compare the current
	        // and target values to check if delay should be taken into account.
	        //
	        // I know that this `if` statement looks scary, but it's pretty simple when you know what is going on
	        // - it's simply comparing all the values.
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
	        currentState = target;
	        activeStep = el;

	        //-------------------------
	        // onStepEnter 이벤트
	        //-------------------------

	        // And here is where we trigger `impress:stepenter` event.
	        // We simply set up a timeout to fire it taking transition duration (and possible delay) into account.
	        // If you want learn something interesting and see how it was done with `transitionend` go back to
	        // version 0.5.2 of impress.js: http://github.com/bartaz/impress.js/blob/0.5.2/js/impress.js

            // 2개의 transition 종료 시점에 이벤트 발생시킴
	        window.clearTimeout(stepEnterTimeout);
	        stepEnterTimeout = window.setTimeout(function () {
	            onStepEnter(activeStep);
	        }, duration + delay);

	        return el;
	    };

	    // parameter에 해당하는 step element 를 반환한다.
	    // number 이면 index로 찾는다.
	    // string 이면 id 로 찾는다
	    // DOM element 이면 올바른 step element 인지 확인 후 리턴
	    var getStep = function (step) {
	        if (typeof step === "number") {
	            step = step < 0 ? steps[steps.length + step] : steps[step];
	        } else if (typeof step === "string") {
	            step = byId(step);
	        }
	        return (step && step.id && stepsData["impress-" + step.id]) ? step : null;
	    };

	    ///////////////////////////
	    // prev, next
	    ///////////////////////////

	    // `prev` API function goes to previous step (in document order)
	    var prev = function () {
	        var prev = steps.indexOf(activeStep) - 1;
	        prev = prev >= 0 ? steps[prev] : steps[steps.length - 1];

	        return goto(prev);
	    };

	    // `next` API function goes to next step (in document order)
	    var next = function () {
	        var next = steps.indexOf(activeStep) + 1;
	        next = next < steps.length ? steps[next] : steps[0];

	        return goto(next);
	    };





	    ////////////////////////////////////////////////////////
	    // HASH
	    ////////////////////////////////////////////////////////

	    // Adding hash change support.
	    root.addEventListener("impress:init", function () {

	        // last hash detected
	        var lastHash = "";

	        // `#/step-id` is used instead of `#step-id` to prevent default browser scrolling to element in hash.
	        // And it has to be set after animation finishes, because in Chrome it makes transtion laggy.
	        // BUG: http://code.google.com/p/chromium/issues/detail?id=62820

	        root.addEventListener("impress:stepenter", function (event) {
	            window.location.hash = lastHash = "#/" + event.target.id;
	        }, false);

	        window.addEventListener("hashchange", function () {
	            // When the step is entered hash in the location is updated
	            // (just few lines above from here), so the hash change is 
	            // triggered and we would call `goto` again on the same element.
	            
	            // To avoid this we store last entered hash and compare.
	            if (window.location.hash !== lastHash) {
	                goto(getElementFromHash());
	            }
	        }, false);

	        // START 
	        // by selecting step defined in url or first step of the presentation
	        goto(getElementFromHash() || steps[0], 0);

	    }, false);

	    // returns an element located by id from hash part of window location.
	    function getElementFromHash () {
	        // get id from url # by removing `#` or `#/` from the beginning,
	        // so both "fallback" `#slide-id` and "enhanced" `#/slide-id` will work
	        return byId(window.location.hash.replace(/^#\/?/, ""));
	    };



















	    // 초기화 전까지는 disabled로 설정함
	    body.classList.add("impress-disabled");

	    //-------------------------
	    // API 리턴
	    //-------------------------

	    // store and return API for given impress.js root element
	    roots["impress-root-" + rootId] = {
	        init: init,
	        goto: goto,
	        next: next,
	        prev: prev
	    };

	    return roots["impress-root-" + rootId];

	};











    //*************************************
    // CHECK SUPPORT
    // flag that can be used in JS to check if browser have passed the support test
	
	if (!impressSupported) {
	    body.className += " impress-not-supported ";
	} else {
	    body.classList.remove("impress-not-supported");
	    body.classList.add("impress-supported");
	}

    //impress.supported = impressSupported;

    //*************************************



})(document, window);





//===============================================================
// 윈도우 리사이징
//===============================================================


(function (document, window) {

    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {

        // 초기화된 객체의 api
        var api = event.detail.api;

        // rescale 재조정
        window.addEventListener("resize", throttle(function () {
            // force going to active step again, to trigger rescaling
            api.goto(document.querySelector(".step.active"), 500);
        }, 250), false);

        // 중첩 실행되지 않도록
        // http://remysharp.com/2010/07/21/throttling-function-calls/
        function throttle(fn, delay) {
            var timer = null;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                }, delay);
            };
        };

    }, false);

})(document, window);

//===============================================================
// NAVIGATION : (KEY, CLICK)
//===============================================================

(function (document, window) {


    // wait for impress.js to be initialized
    document.addEventListener("impress:init", function (event) {

        // 초기화된 객체의 api
        var api = event.detail.api;

        //-------------------------
        // 클릭 이벤트 - step 링크를 클릭한 경우
        //-------------------------

        // delegated handler for clicking on the links to presentation steps
        document.addEventListener("click", function (event) {
            // event delegation with "bubbling"
            // check if event target (or any of its parents is a link)
            var target = event.target;
            while ((target.tagName !== "A") && (target !== document.documentElement)) {
                target = target.parentNode;
            }

            if (target.tagName === "A") {
                var href = target.getAttribute("href");

                // if it's a link to presentation step, target this step
                if (href && href[0] === '#') {
                    target = document.getElementById(href.slice(1));
                }
            }

            if (api.goto(target)) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }
        }, false);

        //-------------------------
        // 클릭 이벤트 - step elements를 클릭한 경우
        //-------------------------

        document.addEventListener("click", function (event) {
            var target = event.target;
            // find closest step element that is not active
            while (!(target.classList.contains("step") && !target.classList.contains("active")) && (target !== document.documentElement)) {
                target = target.parentNode;
            }

            if (api.goto(target)) {
                event.preventDefault();
            }
        }, false);

    }, false);

})(document, window);