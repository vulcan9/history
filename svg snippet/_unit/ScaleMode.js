
/** 원본 크기대로 보여줌 (scale = 1) */
//ScaleMode.SCALE_SOURCE = "source";

/** 너비에 맞춤 */
ScaleMode.SCALE_HORIZONTAL = "horizontal"; 

/** 높이에 맞춤 */
ScaleMode.SCALE_VERTICAL = "vertical"; 

/** 가로 세로 관계없이 항상 창크기에 꽉차게 보여줌 */
ScaleMode.SCALE_WINDOW = "window"; 

/** 직접 수치로 대입한 경우(zoom) */
ScaleMode.SCALE_CUSTOM = "custom";

/** 풀스크린 화면으로 보여줌 */
//ScaleMode.SCALE_SCREEN:String = "screen"; 

function ScaleMode(initObj, scaleModeOrNumber) {

	this._scaleMode = ScaleMode.SCALE_CUSTOM;
	this._currentScale = 1;
	
	//--------------
	// Property 정의 (생략하면 안됨)
	//--------------

	// 100%일때 크기
	this._sourceWidth = 0;
	this._sourceHeight = 0;
	// 비교 기준 크기
	this._compareWidth = 0;
	this._compareHeight = 0;

	//--------------
	// Property 설정
	//--------------

	this.set(initObj, scaleModeOrNumber);
}

ScaleMode.prototype = {

	//-----------------------
	// scale, scaleMode
	//-----------------------

	scale: function () {
		// GET
		if (arguments.length == 0) return this._currentScale;

		// SET
		return this.set(arguments[0]);
	},

	scaleMode: function () {
		// GET
		if (arguments.length == 0) return this._scaleMode;
		
		// SET
		return this.set(arguments[0]);
	},

	/*
	//scale
	set(0.5);

	// mode
	set(ScaleMode.SCALE_WINDOW);

	// reset
	set({sourceWidth:0, sourceHeight:0, compareWidth:0, compareHeight:0});
	set({sourceWidth:0, sourceHeight:0, compareWidth:0, compareHeight:0}, scaleModeOrNumber);
	*/

	//-----------------------
	// get, set
	//-----------------------

	set: function () {
		if (arguments.length == 0) return this;

		var o = arguments[0];
		if (typeof o == "number" || typeof o == "string") {
			var scaleModeOrNumber = o;
			this._currentScale = this._refresh(scaleModeOrNumber);
		} else {
			if (!o) return this;
			this._reset(o);

			var scaleModeOrNumber = arguments[1];
			this._currentScale = this._refresh(scaleModeOrNumber);
		}
		
		return this;
	},

	get: function(property){
		var propName = "_" + property;

		if (propName in this) {
			return this[propName];
		}
		throw "[ScaleMode Error] " + property + " 속성을 찾을 수 없습니다.";
	},
	
	// _reset({sourceWidth:0, sourceHeight:0, compareWidth:0, compareHeight:0})
	_reset: function () {

		if (arguments.length == 0) return this;
		
		var o = arguments[0];
		if(!o) return this;

		for (var prop in o) {
			//console.log(prop, o[prop]);
			var propName = "_" + prop;
			if (propName in this) {
				var num = this._getNumber(o[prop]);
				if (num !== undefined) this[propName] = num;
			}
		}

		return this;
	},

	// _refresh() : 기존값 그대로 다시 계산한다.
	// _refresh(scaleModeOrNumber) : scaleModeOrNumber값을 적용하여 현재의 상태를 갱신한다.
	_refresh: function (scaleModeOrNumber) {

		var scale;
		if (arguments.length == 0) {

			if (this._scaleMode == ScaleMode.SCALE_CUSTOM) {
				// _currentScale 값 변동 없음
				scale = this._setScale(this._currentScale);
			} else {
				// scaleMode에 따라 _currentScale 다시 계산한다.
				// _currentScale은 바뀌어도 _scaleMode 는 바뀌지 않아야 한다.
				scale = this._setScale(this._scaleMode);
			}

		} else {
			scale = this._setScale(scaleModeOrNumber);
		}

		return scale;
	},

	////////////////////////////////
	// SCALE 설정
	////////////////////////////////
	
	/**
	 * mode에 따라 연산된 scale값을 반환한다.
	 * @param mode scaleMode 설정 상수
	 * @return 연산된 scale
	 */
	_setScale: function (scaleModeOrNumber) {

		var scale;
		try {
			switch (scaleModeOrNumber) {
				case ScaleMode.SCALE_HORIZONTAL:
					scale = this._type_horizontal();
					break;
				case ScaleMode.SCALE_VERTICAL:
					scale = this._type_vertical();
					break;
				case ScaleMode.SCALE_WINDOW:
					scale = this._type_window();
					break;

				case ScaleMode.SCALE_CUSTOM:
				default:
					var num = this._getNumber(scaleModeOrNumber);
					if (num == undefined) num = this._currentScale;
					scale = this._type_custom(num);
					break;
			}
		}
		catch (error) {
			console.log("* Scale 연산중 오류 발생 : ", error);
			scale = this._currentScale;
		}

		scale = Math.floor(scale *100)/100;
		return scale;
	},

	_getNumber: function (num) {
		if (typeof num == "number") return num;

		var s = parseFloat(num, 10);
		return isNaN(s) ? undefined : s;
	},

	//-----------------------
	// scale 알아내기 - CASE 별로 연산
	//-----------------------

	// scale로 지정됨
	_type_custom: function (scale) {
		this._scaleMode = ScaleMode.SCALE_CUSTOM;
		return scale;
	},

	// 가로로 꽉참
	_type_horizontal: function () {
		this._scaleMode = ScaleMode.SCALE_HORIZONTAL;
		var scale = this._compareWidth / this._sourceWidth;
		return scale;
	},

	// 세로로 꽉참
	_type_vertical: function () {
		this._scaleMode = ScaleMode.SCALE_VERTICAL;
		var scale = this._compareHeight / this._sourceHeight;
		return scale;
	},

	// 가로,세로 상관없이 화면에 꽉참
	_type_window: function () {
		var scale_h = this._type_horizontal();
		var scale_v = this._type_vertical();
		var scale = Math.min(scale_h, scale_v);

		this._scaleMode = ScaleMode.SCALE_WINDOW;
		return scale;
	},

	/*
	// 100% 크기
	_type_source: function () {
		this._scaleMode = ScaleMode.SCALE_SOURCE;
		var scale = 1;
		return scale;
	},
	*/

	////////////////////////////////
	// END
	////////////////////////////////
};







	





	
		




















	/** currentScale값을 설정. */
	function setScale(scale) {
		_currentScale = scale;

		var mode;
		switch (scale) {
			case getScale(SCALE_HORIZONTAL):
				mode = SCALE_HORIZONTAL;
				break;
			case getScale(SCALE_VERTICAL):
				mode = SCALE_VERTICAL;
				break;
			case getScale(SCALE_SOURCE):
				mode = SCALE_SOURCE;
				break;
			case getScale(SCALE_WINDOW):
				// 이경우는 나타나지 않음.
				// SCALE_HORIZONTAL 또는 SCALE_VERTICAL로 이미 걸러진 상태임.
				mode = SCALE_WINDOW;
				break;
			default:
				mode = SCALE_CUSTOM;
		}
		_scaleMode = mode;
	}































