
///////////////////////////////////////////////////
//
// DragUtilClass - 드래그 기능
// ver.2014.02.07
//
///////////////////////////////////////////////////

//***************************************************************

// $dragger(드래그 대상)은 position:absolute로 설정되어 있어야 드래그 가능합니다.
//  사용 샘플은 최 하단에 있음

//*************************************************************** 

"use strict";

define(
    [
        'Application', 'U'
    ],
    function( application, U ) {

        // 등록
        application.factory( 'Resizer', _factory );
	
        // 선언
        function _factory() {
        	
        		out( 'Resizer 등록 : ' );

		////////////////////////////////////////
		// 생성자
		////////////////////////////////////////

		function Resizer (){
			this.dragUtil = {
				// 위치 이동 저장
				_startX : 0,
				_startY : 0,
				// 최대, 최소 이동 가능한 값
				minX:0,
				minY:0,
				maxX:0,
				maxY:0
			};
			
			// true : 한계 영역밖으로 벗어나지 않음
			// false : 한계 체크하지 않음
			this.dragLimitOption = false;
			
			// 드래그 방향 설정 : n, e, w, s, se, sw, ne, nw
			this.direction = "";
			
			// 사용자가 직접 dragUtil의 한계치를 설정
			this.minX = null;
			this.minY = null;
			this.maxX = null;
			this.maxY = null;
			
			// 드래그 감지 Dealy 오프셋 (pixel)
			this.delay = 0;

			// 최상위 depth로 이동 (true)
			this.swapIndex = false;

			// 드래그 적용 대상 ($객체임)
			this.resizeTarget = null;

			// 현재 마우스 이벤트를 받고있는 이벤트 리스너 ownwr
			this.$currentEventTarget = null;

			// snap 조사 객체
			this.snap = null;
		}
		
		////////////////////////////////////
		// Prototype
		////////////////////////////////////

		Resizer.prototype = {
			addEvent : function (type, handler){
				if(this.$dragger == null) return;
				this.$dragger.on(type, handler);
			},

			removeEvent : function (type, handler){
				if(this.$dragger == null) return;
				this.$dragger.off(type, handler);
			},
			
			initialize : function($icon, initObj){
				if(this.$dragger){
					this.$dragger.off("mousedown", $.proxy(this._onMouseDown_drag, this));
					this.$dragger.off("click", $.proxy(this._onClick, this));
				}
				
				// 드래그 버튼 기능
				this.$dragger = $icon;
				
				if(this.$dragger){
					this.$dragger.on("mousedown", $.proxy(this._onMouseDown_drag, this));
					this.$dragger.on("click", $.proxy(this._onClick, this));
				}else{
					return;
				}
				
				for(var prop in initObj){
					if(prop in this){
						this[prop] = initObj[prop];
					}
				}
			},

			//---------------------------
			// px 을 포함한 값 -> 숫자.
			//---------------------------
			//value = value.replace(/px/gi, "");
			getPureNumber : function (value) {
				if (typeof value == "number") return value;
				
				/*
				var regNum = /^\d+$/;	// numeric check
				var regPx = /px$/i;		// ends with 'px'
				// parse to integer.
				var numVal = 0;
				if (regNum.test(value)) {
					numVal = parseFloat(value, 10);
				} else if (regPx.test(value)) {
					numVal = parseFloat(value.substring(0, value.length - 2), 10);
				}
				return numVal;
				*/
		                var num = parseFloat(value, 10);
		                return isNaN(num) ? (fallback || 0) : num;
		                return num;
			},

			////////////////////////////////////
			// Drag
			////////////////////////////////////

			_onMouseDown_drag : function (event){

				this.$currentEventTarget = $(event.target);

				this.dragUtil._startX = event.pageX;
				this.dragUtil._startY = event.pageY;
				
				var $resizeTarget = this.resizeTarget || this.$currentEventTarget;
				var x = $resizeTarget.css("left");
				var y = $resizeTarget.css("top");
				x = this.getPureNumber(x);
				y = this.getPureNumber(y);
				var w = $resizeTarget.width();
				var h = $resizeTarget.height();

				this._origin = { x: x, y: y, w: w, h: h };
				this._last = { x: x, y: y, w: w, h: h };
				
				var target = $(document);
				target.on("mousemove", $.proxy(this._onMouseMove_drag, this));
				target.on("mouseup", $.proxy(this._onMouseUp_drag, this));
				
				// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
				// (click 이벤트 발생 안하는 경우가 있어 mouseumove에서 설정하는 것으로 변경함)
				// if(this.swapIndex) this.setTopIndex();

				// 이벤트 발송
				this._isMoved = false;
				//this.$currentEventTarget.trigger({type:"dragStart", mouseEvent:event});
				
				// prevents text selection
				//event.preventDefault();
				//return false;
			},

			_onMouseMove_drag : function (event){
				
				var $resizeTarget = this.resizeTarget || this.$currentEventTarget;

				// 이동 거리
				var distX = event.pageX - this.dragUtil._startX;
				var distY = event.pageY - this.dragUtil._startY;

				var x = this._origin.x;
				var y = this._origin.y;
				var w = this._origin.w;
				var h = this._origin.h;
				
				if(!this._isMoved)
				{
					// 드래그 delay 감지
					if(this.delay > 0){
						if(distX < this.delay && distY < this.delay){
							return;
						}
					}
					
					var startEvent = $.Event("Resizer.resizeStart", {distX:distX, distY:distY, x:x, y:y, width:w, height:h});
					this.$currentEventTarget.trigger(startEvent);
					
					this._isMoved = true;

					if(event.isDefaultPrevented() || startEvent.isDefaultPrevented()){
						return;
					}
					
					// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
					if(this.swapIndex) this.setTopIndex();
				}

				//--------------------
				// Snap / Position 체크
				//--------------------

				// BUG : scale 적용에 의한 소수점 좌표, 너비, 높이에 의해 (scale 전환시) 1px 차이가 날 수 있음

				var snapX = x;
				var snapY = y;
				var snapW = x+w;
				var snapH = y+h;
				// x
				if(this.direction == 'nw' || this.direction == 'w' || this.direction == 'sw'){
					snapX = this.snap.snapToPixel(x, distX);
				}
				// y
				if(this.direction == 'nw' || this.direction == 'n' || this.direction == 'ne'){
					snapY = this.snap.snapToPixel(y, distY);
				}
				// w
				if(this.direction == 'ne' || this.direction == 'e' || this.direction == 'se'){
					snapW = this.snap.snapToPixel(x+w, distX);
				}
				// h
				if(this.direction == 'sw' || this.direction == 's' || this.direction == 'se'){
					snapH = this.snap.snapToPixel(y+h, distY);
					out('snapH : ', y+h, snapH, distY);
				}

				//--------------------
				// 이동한 포인트 제한 체크
				//--------------------

				if(this.dragLimitOption)
				{
					// 드래그 범위 지정
					this._setDragLimit();
					
					// 앵커 위치에 따라 제한값 달라짐
					// x
					if(this.direction == 'nw' || this.direction == 'w' || this.direction == 'sw'){
						this.dragUtil.maxX = x + w;
					}
					// y
					if(this.direction == 'nw' || this.direction == 'n' || this.direction == 'ne'){
						this.dragUtil.maxY = y + h;
					}
					// w
					if(this.direction == 'ne' || this.direction == 'e' || this.direction == 'se'){
						this.dragUtil.minX = x;
					}
					// h
					if(this.direction == 'sw' || this.direction == 's' || this.direction == 'se'){
						this.dragUtil.minY = y;
					}

					// 드래그 범위 지정 보정치
					var limit = this._checkLimit.apply(this, [snapX, snapY]);
					snapX = limit.x;
					snapY = limit.y;

					var limit = this._checkLimit.apply(this, [snapW, snapH]);
					snapW = limit.x;
					snapH = limit.y;
					out('---> : ',  this.dragUtil.maxY, snapH );
				}

				//--------------------
				// 이동량에 따른 크기 보정 체크
				//--------------------
				
				var newW = w;
				var newH = h;
				// x
				if(this.direction == 'nw' || this.direction == 'w' || this.direction == 'sw'){
					var distW = snapX - x;
					newW = w - distW;
				}
				// y
				if(this.direction == 'nw' || this.direction == 'n' || this.direction == 'ne'){
					var distH = snapY - y;
					newH = h - distH;
				}
				// w
				if(this.direction == 'ne' || this.direction == 'e' || this.direction == 'se'){
					var distW = snapW - (x+w);
					newW = w + distW;
				}
				// h
				if(this.direction == 'sw' || this.direction == 's' || this.direction == 'se'){
					var distH = snapH - (y+h);
					newH = h + distH;
				}

				//--------------------

				x = snapX;
				y = snapY;
				w = newW;
				h = newH;

				// 최종값 저장
				this._last = { x: x, y: y, w: w, h: h };

				// 이벤트 발송
				var newEvent = $.Event("Resizer.resize", {distX:distX, distY:distY, x:x, y:y, width:w, height:h});
				this.$currentEventTarget.trigger(newEvent);

				if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
					return;
				}

				// 위치 갱신
				$resizeTarget.css({
					"left": x,
					"top": y,
					"width": w,
					"height": h
				});
				//console.log(x, y);
			},
			
			_onMouseUp_drag : function (event){
				// var target = $(event.currentTarget);
				var target = $(document);
				target.off("mousemove", $.proxy(this._onMouseMove_drag, this));
				target.off("mouseup", $.proxy(this._onMouseUp_drag, this));
				
				if(this._isMoved){
					this._isMoved = false;
					
					// 이동 거리
					var distX = event.pageX - this.dragUtil._startX;
					var distY = event.pageY - this.dragUtil._startY;

					var x = this._last.x;
					var y = this._last.y;
					var w = this._last.w;
					var h = this._last.h;
					
					// 이벤트 발송
					//this.dispatchChangeEvent();
					var newEvent = $.Event("Resizer.resizeEnd", {distX:distX, distY:distY, x:x, y:y, width:w, height:h});
					this.$currentEventTarget.trigger(newEvent);

					if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
						this.$currentEventTarget = null;
						return;
					}
				}
				this.$currentEventTarget = null;
			},
			
			// 마우스가 이동한 경우 Click 이벤트 막음
			_onClick : function (event){
				if(this._isMoved){
					event.preventDefault();
					event.stopImmediatePropagation();
					this._isMoved = false;
				}else{
					var newEvent = $.Event("Resizer.clicked");
					$(event.target).trigger(newEvent);

					if(event.isDefaultPrevented() || newEvent.isDefaultPrevented()){
						this.$currentEventTarget = null;
						return;
					}
				}
				this.$currentEventTarget = null;
			},

			////////////////////////////////////////////////////////////////////////
			// 유효성 검사, Snap 체크
			////////////////////////////////////////////////////////////////////////
			
			// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
			setTopIndex : function(){
				this.$currentEventTarget.appendTo(this.$currentEventTarget.parent());

				if(this.resizeTarget){
					this.resizeTarget.appendTo(this.resizeTarget.parent());
				}
			},

			// 드래그 허용 범위내의 값으로 변환
			_checkLimit : function (x, y){
				//console.log(x,y,this.dragUtil.maxX, this.dragUtil.maxY);
				if(this.dragUtil.minX > x) x = this.dragUtil.minX;
				if(this.dragUtil.maxX < x) x = this.dragUtil.maxX;
				
				if(this.dragUtil.minY > y) y = this.dragUtil.minY;
				if(this.dragUtil.maxY < y) y = this.dragUtil.maxY;

				return {x:x, y:y};
			},

			// 드래그 허용 범위 설정
			_setDragLimit : function (){

				var $resizeTarget = this.resizeTarget || this.$currentEventTarget;
				var $parent = $resizeTarget.parent();
				
				this.dragUtil.minX = 0;
				this.dragUtil.minY = 0;
				this.dragUtil.maxX = $parent.innerWidth();
				this.dragUtil.maxY = $parent.innerHeight();
				
				// 사용자가 지정한 값이 있는 경우
				if(!isNaN(this.minX) && this.minX !== null) this.dragUtil.minX = this.minX;
				if(!isNaN(this.minY) && this.minY !== null) this.dragUtil.minY = this.minY;
				if(!isNaN(this.maxX) && this.maxX !== null) this.dragUtil.maxX = this.maxX;
				if(!isNaN(this.maxY) && this.maxY !== null) this.dragUtil.maxY = this.maxY;
				
				//console.log($parent.innerWidth(), offsetX);
			},





























			// n, e, w, s, se, sw, ne, nw
			_nextRetangle : function (x, y, w, h, distX, distY){
				
				if(this.direction == 'n'){
					y = this.snap.snapToPixel(y, distY);

				}else if(this.direction == 's'){

					var sObj = this._next_s(y, h, distY)
					y = sObj.y;
					h = sObj.h;

				}else if(this.direction == 'w'){
					
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;

				}else if(this.direction == 'e'){

					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;

				}else if(this.direction == 'nw'){

					// n
					var nObj = this._next_n(y, h, distY);
					y = nObj.y;
					h = nObj.h;
					// w
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;

				}else if(this.direction == 'ne'){
					
					// n
					var nObj = this._next_n(y, h, distY);
					y = nObj.y;
					h = nObj.h;
					// e
					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;

				}else if(this.direction == 'sw'){
					
					// s
					var sObj = this._next_s(y, h, distY);
					y = sObj.y;
					h = sObj.h;
					// w
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;

				}else if(this.direction == 'se'){
					
					// s
					var sObj = this._next_s(y, h, distY);
					y = sObj.y;
					h = sObj.h;
					// e
					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;
				}

				return { x: x, y: y,  w: w, h: h };
			},

			_next_n : function (y, h, distY){
				
				var snapY = this.snap.snapToPixel(y, distY);
				var changed_y = (snapY != y);

				var newY = y;
				var newH = h;
				if(changed_y) {
					newY = snapY;
					var distH = newY - y;
					newH = h - distH;
				}

				if(this.dragLimitOption){
					if(newY <= this.dragUtil.minY){
						newY = this.dragUtil.minY;
						newH = h + (y - this.dragUtil.minY);
					}
					if(newH < 0){
						// newY = this.snap.snapToPixel(y, 0);
						// newH = h;
						newH = 0;
					}
				}

				// y = newY;
				// h = newH;

				return {
					y: newY, h: newH, 
					changed_y: (newY != y),
					changed_h: (newH != h)
				};
				
				/*
				var newY = y + distY;
				var newH = h - distY;

				if(this.dragLimitOption){
					if(newY <= this.dragUtil.minY){
						newY = this.dragUtil.minY;
						newH = h + (y - this.dragUtil.minY);
					}
					if(newH <= 0){
						newY = y + h;
						newH = 0;
					}
				}

				y = newY;
				h = newH;

				return {y:y, h:h, changed:changed};
				*/
			},

			_next_s : function (y, h, distY){
				
				var hPos = y + h;
				var snapH = this.snap.snapToPixel(hPos, distY);
				var changed_h = (snapH != hPos);

				var newY = y;
				var newH = snapH - y;
				// var newY = y;
				// var newH = h + distY;

				if(this.dragLimitOption){
					if(newY + newH > this.dragUtil.maxY){
						newH = this.dragUtil.maxY - newY;
					}
					if(newH < 0){
						newH = h;
					}
				}

				// y = newY;
				// h = newH;

				return {
					y: newY, h: newH, 
					changed_y: (newY != y),
					changed_h: (newH != h)
				};

				/*
				var newY = y;
				var newH = h + distY;

				if(this.dragLimitOption){
					if(newY + newH > this.dragUtil.maxY){
						newH = this.dragUtil.maxY - newY;
					}
					if(newH <= 0){
						newH = 0;
					}
				}

				y = newY;
				h = newH;

				return {y:y, h:h};
				*/
			},

			_next_w : function (x, w, distX){
				
				var snapX = this.snap.snapToPixel(x, distX);
				var changed_x = (snapX != x);

				var newX = x;
				var newW = w;
				if(changed_x) {
					newX = snapX;
					var distW = newX - x;
					newW = w - distW;
				}

				if(this.dragLimitOption){
					if(newX <= this.dragUtil.minX){
						newX = this.dragUtil.minX;
						newW = w + (x - this.dragUtil.minX);
					}
					if(newW < 0){
						newX = this.snap.snapToPixel(x, 0);
						newW = w;
					}
				}

				// x = newX;
				// w = newW;

				return {
					x: newX, w: newW, 
					changed_x: (newX != x),
					changed_w: (newW != w)
				};

				/*
				var newX = x + distX;
				var newW = w - distX;

				if(this.dragLimitOption){
					if(newX <= this.dragUtil.minX){
						newX = this.dragUtil.minX;
						newW = w + (x - this.dragUtil.minX);
					}
					if(newW <= 0){
						newX = x + w;
						newW = 0;
					}
				}

				x = newX;
				w = newW;

				return {x:x, w:w};
				*/
			},

			_next_e : function (x, w, distX){
				
				var wPos = x + w;
				var snapW = this.snap.snapToPixel(wPos, distX);
				var changed_w = (snapW != wPos);

				var newX = x;
				var newW = snapW - x;

				if(this.dragLimitOption){
					if(newX + newW > this.dragUtil.maxX){
						newW = this.dragUtil.maxX - newX;
					}
					if(newW < 0){
						newW = w;
					}
				}

				// x = newX;
				// w = newW;

				return {
					x: newX, w: newW, 
					changed_x: (newX != x),
					changed_w: (newW != w)
				};

				/*
				var newX = x;
				var newW = w + distX;

				if(this.dragLimitOption){
					if(newX + newW > this.dragUtil.maxX){
						newW = this.dragUtil.maxX - newX;
					}
					if(newW <= 0){
						newW = 0;
					}
				}

				x = newX;
				w = newW;

				return {x:x, w:w};
				*/
			}
			/*
			// n, e, w, s, se, sw, ne, nw
			_nextRetangle : function (x, y, w, h, distX, distY){
				var changed_x = false;
				var changed_y = false;
				var changed_w = false;
				var changed_h = false;
				if(this.direction == 'n'){

					var nObj = this._next_n(y, h, distY);
					y = nObj.y;
					h = nObj.h;
					changed_y = nObj.changed_y;
					changed_h = nObj.changed_h;

				}else if(this.direction == 's'){

					var sObj = this._next_s(y, h, distY)
					y = sObj.y;
					h = sObj.h;
					changed_y = sObj.changed_y;
					changed_h = sObj.changed_h;

				}else if(this.direction == 'w'){
					
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;
					changed_x = wObj.changed_x;
					changed_w = wObj.changed_w;

				}else if(this.direction == 'e'){

					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;
					changed_x = eObj.changed_x;
					changed_w = eObj.changed_w;

				}else if(this.direction == 'nw'){

					// n
					var nObj = this._next_n(y, h, distY);
					y = nObj.y;
					h = nObj.h;
					changed_y = nObj.changed_y;
					changed_h = nObj.changed_h;
					// w
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;
					changed_x = wObj.changed_x;
					changed_w = wObj.changed_w;

				}else if(this.direction == 'ne'){
					// h = h - distY;
					// y = y + distY;
					// w = w + distX;
					
					// n
					var nObj = this._next_n(y, h, distY);
					y = nObj.y;
					h = nObj.h;
					changed_y = nObj.changed_y;
					changed_h = nObj.changed_h;
					// e
					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;
					changed_x = eObj.changed_x;
					changed_w = eObj.changed_w;

				}else if(this.direction == 'sw'){
					// h = h + distY;
					// w = w - distX;
					// x = x + distX;

					// s
					var sObj = this._next_s(y, h, distY);
					y = sObj.y;
					h = sObj.h;
					changed_y = sObj.changed_y;
					changed_h = sObj.changed_h;
					// w
					var wObj = this._next_w(x, w, distX);
					x = wObj.x;
					w = wObj.w;
					changed_x = wObj.changed_x;
					changed_w = wObj.changed_w;

				}else if(this.direction == 'se'){
					// h = h + distY;
					// w = w + distX;
					
					// s
					var sObj = this._next_s(y, h, distY);
					y = sObj.y;
					h = sObj.h;
					changed_y = sObj.changed_y;
					changed_h = sObj.changed_h;
					// e
					var eObj = this._next_e(x, w, distX);
					x = eObj.x;
					w = eObj.w;
					changed_x = eObj.changed_x;
					changed_w = eObj.changed_w;
				}

				return {
					x: x, y: y, 
					w: w, h: h, 
					changed_x: changed_x, 
					changed_y: changed_y, 
					changed_w: changed_w, 
					changed_h: changed_h
				};
			},
			
			_next_n : function (y, h, distY){
				
				var snapY = this.snap.snapToPixel(y, distY);
				var changed_y = (snapY != y);

				var newY = y;
				var newH = h;
				if(changed_y) {
					newY = snapY;
					var distH = newY - y;
					newH = h - distH;
				}

				if(this.dragLimitOption){
					if(newY <= this.dragUtil.minY){
						newY = this.dragUtil.minY;
						newH = h + (y - this.dragUtil.minY);
					}
					if(newH < 0){
						// newY = this.snap.snapToPixel(y, 0);
						// newH = h;
						newH = 0;
					}
				}

				// y = newY;
				// h = newH;

				return {
					y: newY, h: newH, 
					changed_y: (newY != y),
					changed_h: (newH != h)
				};
			},

			_next_s : function (y, h, distY){
				
				var hPos = y + h;
				var snapH = this.snap.snapToPixel(hPos, distY);
				var changed_h = (snapH != hPos);

				var newY = y;
				var newH = snapH - y;
				// var newY = y;
				// var newH = h + distY;

				if(this.dragLimitOption){
					if(newY + newH > this.dragUtil.maxY){
						newH = this.dragUtil.maxY - newY;
					}
					if(newH < 0){
						newH = h;
					}
				}

				// y = newY;
				// h = newH;

				return {
					y: newY, h: newH, 
					changed_y: (newY != y),
					changed_h: (newH != h)
				};
			},

			_next_w : function (x, w, distX){
				
				var snapX = this.snap.snapToPixel(x, distX);
				var changed_x = (snapX != x);

				var newX = x;
				var newW = w;
				if(changed_x) {
					newX = snapX;
					var distW = newX - x;
					newW = w - distW;
				}

				if(this.dragLimitOption){
					if(newX <= this.dragUtil.minX){
						newX = this.dragUtil.minX;
						newW = w + (x - this.dragUtil.minX);
					}
					if(newW < 0){
						newX = this.snap.snapToPixel(x, 0);
						newW = w;
					}
				}

				// x = newX;
				// w = newW;

				return {
					x: newX, w: newW, 
					changed_x: (newX != x),
					changed_w: (newW != w)
				};
			},

			_next_e : function (x, w, distX){
				
				var wPos = x + w;
				var snapW = this.snap.snapToPixel(wPos, distX);
				var changed_w = (snapW != wPos);

				var newX = x;
				var newW = snapW - x;

				if(this.dragLimitOption){
					if(newX + newW > this.dragUtil.maxX){
						newW = this.dragUtil.maxX - newX;
					}
					if(newW < 0){
						newW = w;
					}
				}

				// x = newX;
				// w = newW;

				return {
					x: newX, w: newW, 
					changed_x: (newX != x),
					changed_w: (newW != w)
				};
			}
			*/

			////////////////////////////////
			// Prototype END
			////////////////////////////////
			// _factory  end
		};


		////////////////////////////////////////
		// END
		////////////////////////////////////////

		// 서비스 객체 리턴
		return Resizer;
        }

        // 리턴
        return _factory;
    }
);









/*
		//--------------------------
		// splitBar 드래그 기능 구현 예
		//--------------------------

		// DOM (View) 쪽으로부터 이벤트 받음
		//{"<EVENT_TYPE> <ELEMENT_ID>": "<CALLBACK_FUNTION>"}
		// ex : events: {'keypress #new-todo': 'createTodoOnEnter'}
		// == : $('#new-todo').keypress(createTodoOnEnter);
		
		events: {
			//splitBar
			//'mousedown #splitBar': 'onMouseDown_splitBar',
		},
		
		clearDrag: function (){
			if(!this._dragUtil) return;
			this._dragUtil.removeEvent("dragStart", $.proxy(this._onDragStart, this));
			this._dragUtil.removeEvent("dragEnd", $.proxy(this._onDragEnd, this));
			this._dragUtil.removeEvent("drag", $.proxy(this._onDrag, this));
			this._dragUtil.removeEvent("clicked", $.proxy(this._onClick, this));
			this._dragUtil = null;
			
			var $splitBar = this.$el.find("#splitBar");
			$splitBar.css({"cursor":"default"});
		},
		
		setDrag: function (){
			this.clearDrag();
			
			var initObj = {
				direction : "x"
				,dragLimitOption : "inner"
				// 한계치 지정하지 않으려면 반드시 null을 설정한다.
				,minX : 427
				,minY : null
				,maxX : this.$el.width() - 499
				,maxY : null
			};
			
			var $splitBar = this.$el.find("#splitBar");
			$splitBar.css({"cursor":"e-resize"});
			
			this._dragUtil = new DragUtilClass();
			this._dragUtil.initialize($splitBar, initObj);
			
			this._dragUtil.addEvent("dragStart", $.proxy(this._onDragStart, this));
			this._dragUtil.addEvent("dragEnd", $.proxy(this._onDragEnd, this));
			this._dragUtil.addEvent("drag", $.proxy(this._onDrag, this));
			this._dragUtil.addEvent("clicked", $.proxy(this._onClick, this));
		},
		
		refreshDragOption: function(){
			if(!this._dragUtil) return;
			
			var maxX = this.$el.width() - 499;
			var initObj = {maxX : maxX};
			
			var $splitBar = this.$el.find("#splitBar");
			this._dragUtil.initialize($splitBar, initObj);
			
			var pos = u.getPureNumber($splitBar.css("left"));
			if(pos > maxX){
				$splitBar.css({"left":maxX});
				this.splitSize();
			}
		},
		
		_onDragStart: function (e){
			if(!this._splitBarDragable){
				e.preventDefault();
				return;
			}
			//out("_onDragStart");
			if(this.bookView && this.bookView.bookContainer){
				$(this.bookView.bookContainer).css({"visibility":"hidden"});
			}
		},

		_onDrag: function (e){
			if(!this._splitBarDragable){
				e.preventDefault();
				return;
			}
			//out("_onDrag");
			this.splitSize();
		},
		
		// 앵커 드래그(위치변경)로 인한 데이터 갱신
		_onDragEnd: function (e){
			if(!this._splitBarDragable){
				return;
			}
			//out("_onDragEnd");
			this.splitSize();
			
			if(this.bookView && this.bookView.bookContainer){
				$(this.bookView.bookContainer).css({"visibility":"visible"});
			}
		},
		
		_onClick: function(){
			//
		},
*/

