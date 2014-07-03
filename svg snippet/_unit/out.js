
//---------------------------
// 화면 로그 출력
//---------------------------

// 주석 출력 하지 않을때
//window.out = function(){};

!function (outFunc)
{
	if(outFunc) return;
	window.out = out;

	function out() {
		if (!arguments || arguments.length < 1) return;

		//android 로그
		var isandroid = (/android/i).test(navigator.userAgent);
		if (isandroid) {
			//alert("모바일기기로 접속하였습니다.");
			android.apply(this, arguments);
			return;
		}

		// PC형 로그
		pc.apply(this, arguments);
	};

	//----------
	// PC형 로그
	//----------

	function pc() {
		// 시간 기록
		var date = new Date();
		var ms = date.getMilliseconds().toString();
		while (ms.length < 3) ms = "0" + ms;
		var timeLog = "[ " + date.toLocaleString() + "." + ms + " ] ";

		var prefix = "[*]";//++LogCounter.num;

		// newline 처리
		var firstString = arguments[0].toString();
		for (var i = 0; i < firstString.length; ++i) if (firstString.substr(i, 1) != "\n") break;
		if (i == 0) {
			firstString = prefix + ":" + timeLog + firstString;
		} else {
			var newlineStr = firstString.substr(0, i);
			var restStr = firstString.substr(i);
			firstString = newlineStr + prefix + ":" + timeLog + restStr;
		}

		arguments[0] = firstString;

		// IE8에서 이구문은 에러 발생함
		if ((typeof console.log) == "function") {
			//*
			console.log.apply(window.console, arguments);
			/*/
			var str = "";
			for(var i=0; i<arguments.length; ++i){
				str += arguments[i];
			}
			//console.log(str);
			//*/
		}
		//console.log("\n");
	};


	//----------
	//android 로그
	//----------

	function android() {
		var str = "";
		for (var i = 0; i < arguments.length; ++i) {
			str += getString(arguments[i]);
		}

		//console.log(arguments);
		console.log(str);

		// 2 depth 까지만
		var depth = 2;
		function getString(value, tabCount) {

			var str = "";
			var cnt = tabCount || 0;
			tabCount = ++cnt;
			var recurrence = (cnt <= depth);

			var tab = "";
			while (--tabCount > 0) {
				tab += "    ";
			}

			try {
				if (value instanceof Array || Array.isArray(value)) {
					str += "\n" + tab + "<Array>";
					for (var i = 0; i < value.length; ++i) {
						if (recurrence) {
							str += "\n" + tab + "    [" + i + "] : " + getString(value[i], cnt);
						} else {
							str += "\n" + tab + "    [" + i + "] : " + value[i];
						}
					}
					str += "\n" + tab + "</Array>\n";
				} else if (typeof value == "string" || value === null || value === undefined) {
					str += value;

				} else if (value.toString().indexOf("[object HTML") > -1 || value.toString().indexOf("[object XML") > -1) {
					str += value;

				} else if (value.toString().indexOf("[object") > -1) {
					str += "\n" + tab + "<Object>";
					for (var prop in value) {
						if (typeof value[prop] == "function") {
							continue;
						}
						if (recurrence) {
							str += "\n" + tab + "    [" + prop + "] : " + getString(value[prop], cnt);
						} else {
							str += "\n" + tab + "    [" + prop + "] : " + value[prop];
						}
					}
					str += "\n" + tab + "</Object>\n";

				} else {
					str += value;
				}

			} catch (err) {
				str = "\n# log error : " + err;
			}

			return str;
		}
	}

	//end

}(window.out);


