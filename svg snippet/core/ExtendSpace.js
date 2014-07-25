
function out() {
	console.log.apply(console, arguments);
}

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
    		
    		// Override
    		init: function (data) {
				// 초기화
    			// code...

				// super()
    			_super_prototype.init.apply(this, arguments);
    		},

    		///////////////////////////
    		// scaleMode 기능 추가
    		///////////////////////////

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

    		///////////////////////////
    		// 화면 드래그 기능 추가
    		///////////////////////////

			// scale 고정인 경우 자동으로 화면 드래그가 가능하도록






    		///////////////////////////
    		// END PROTOTYPE
    		///////////////////////////
    	}
    }
	

})(document, window);

























































