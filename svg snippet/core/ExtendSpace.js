
(function ( document, window ) {

    ////////////////////////////////////////////////////////
    //
	// Version
	//
	// denpendancy : Space.js, ScaleMode.js
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

    	    // $.pep.unbind($(this.viewport));
    	    // $(this.viewport).pep();

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

                /*
                if (value) {
                    $(this.viewport).pep({
                        hardwareAccelerate: false,
                        multiplier: 1.5
                    });
                }else{
                    $.pep.unbind($(this.viewport));
                }
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

                    /*
                    // transition 없는 이동
                    this.css(this.viewport, {
                        transitionDuration: "0ms",
                        transitionDelay: "0ms"
                    });

                    $(this.viewport).pep({
                        hardwareAccelerate: false,
                        multiplier: 1.5
                    });
                    */
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

    		///////////////////////////
    		// END PROTOTYPE
    		///////////////////////////
    	}
    }
	

})(document, window);

























































