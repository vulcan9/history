
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
        application.factory( 'Drager', _factory );
	
        // 선언
        function _factory($document) {
        	
        		out( 'Drager 등록 : ' );

		////////////////////////////////////////
		// 생성자
		////////////////////////////////////////

		function Drager (){
			this.dragUtil = {
				// 위치 이동 저장
				_tempX : 0,
				_tempY : 0,
				// 최대, 최소 이동 가능한 값
				minX:0,
				minY:0,
				maxX:0,
				maxY:0,
			};
			
			// "inner" : 한계 영역밖으로 벗어나지 않음
			// "center" : 한계 영역 절반정도 걸치도록 offset설정됨
			// "outter" : 한계 영역 외부에 걸치도록 offset설정됨
			// "none" : 한계 체크하지 않음
			this.dragLimitOption = "inner";
			
			// 드래그 방향 설정
			// both : 상하좌우 이동 가능
			// x : x축 방향으로만 이동 가능
			// y : y축 방향으로만 이동 가능
			this.direction = "both";
			
			// 사용자가 직접 dragUtil의 한계치를 설정
			this.minX = null;
			this.minY = null;
			this.maxX = null;
			this.maxY = null;
			
			// 드래그 감지 Dealy 오프셋 (pixel)
			this.delay = 0;
		}
		
		////////////////////////////////////
		// Prototype
		////////////////////////////////////

		Drager.prototype = {
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

			////////////////////////////////////
			// Drag
			////////////////////////////////////

			_onMouseDown_drag : function (event){
				this.dragUtil._tempX = event.pageX;
				this.dragUtil._tempY = event.pageY;
				
				// var target = $(document);
				var target = $document;
				target.on("mousemove", $.proxy(this._onMouseMove_drag, this));
				target.on("mouseup", $.proxy(this._onMouseUp_drag, this));
				
				// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
				// (click 이벤트 발생 안하는 경우가 있어 mouseumove에서 설정하는 것으로 변경함)
				//this.setTopIndex();

				// 드래그 범위 지정
				this._setDragLimit();
				
				// 이벤트 발송
				this._isMoved = false;
				//this.$dragger.trigger({type:"dragStart", mouseEvent:event});
				
				// prevents text selection
				//event.preventDefault();
				//return false;
			},

			_onMouseMove_drag : function (event){
				
				// 이동 거리
				var distX = event.pageX - this.dragUtil._tempX;
				var distY = event.pageY - this.dragUtil._tempY;

				if(!this._isMoved)
				{
					// 드래그 delay 감지
					if(this.delay > 0){
						if(distX < this.delay && distY < this.delay){
							return;
						}
					}
					
					var event = $.Event({type:"dragStart", mouseEvent:event});
					this.$dragger.trigger(event);
					if(event.isDefaultPrevented()){
						// 드래그 중지
						// var target = $(event.currentTarget);
						var target = $document;
						target.off("mousemove", $.proxy(this._onMouseMove_drag, this));
						target.off("mouseup", $.proxy(this._onMouseUp_drag, this));
						return;
					}
					
					this._isMoved = true;
					
					// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
					this.setTopIndex();
				}

				var x = this.$dragger.css("left");
				var y = this.$dragger.css("top");
				x = Math.round(this.getPureNumber(x));
				y = Math.round(this.getPureNumber(y));
				
				x = x + distX;
				y = y + distY;
				
				// 한계 설정
				if(this.dragLimitOption !== 'none'){
					var limit = this._checkLimit.apply(this, [x,y]);
					x = limit.x;
					y = limit.y;
				}
				
				// 위치 갱신
				if(this.direction == 'both' || this.direction == 'x'){
					this.$dragger.css("left", x);
				}
				if(this.direction == 'both' || this.direction == 'y'){
					this.$dragger.css("top", y);
				}
				//console.log(x, y);
				
				this.dragUtil._tempX = event.pageX;
				this.dragUtil._tempY = event.pageY;
				
				// 이벤트 발송
				this.$dragger.trigger({type:"drag", mouseEvent:event});
			},
			
			_onMouseUp_drag : function (event){
				// var target = $(event.currentTarget);
				var target = $document;
				target.off("mousemove", $.proxy(this._onMouseMove_drag, this));
				target.off("mouseup", $.proxy(this._onMouseUp_drag, this));
				
				if(this._isMoved){
					this._isMoved = false;
					
					// 이벤트 발송
					//this.dispatchChangeEvent();
					this.$dragger.trigger({type:"dragEnd", mouseEvent:event});
				}
			},
			
			// 마우스가 이동한 경우 Click 이벤트 막음
			_onClick : function (event){
				if(this._isMoved){
					event.preventDefault();
					event.stopImmediatePropagation();
					this._isMoved = false;
				}else{
					this.$dragger.trigger({type:"clicked", mouseEvent:event});
				}
			},

			////////////////////////////////////
			// Exports
			////////////////////////////////////
			
			// 복수개의 창이 떠 있는 경우 최상위 뎁스로 이동
			setTopIndex : function(){
				this.$dragger.appendTo(this.$dragger.parent());
			},

			// 드래그 허용 범위 설정
			_setDragLimit : function (){
				
				var $dragTarget = this.$dragger;
				var $parent = $dragTarget.parent();
				
				var offsetX = $dragTarget.width();
				var offsetY = $dragTarget.height();
				if(this.dragLimitOption == 'none'){
					this.dragUtil.minX = 0;
					this.dragUtil.minY = 0;
					this.dragUtil.maxX = 0;
					this.dragUtil.maxY = 0;
				}else if(this.dragLimitOption == "outter"){
					this.dragUtil.minX = -offsetX;
					this.dragUtil.minY = -offsetX;
					this.dragUtil.maxX = $parent.innerWidth();
					this.dragUtil.maxY = $parent.innerHeight();
				}else if(this.dragLimitOption == "center"){
					this.dragUtil.minX = -offsetX/2;
					this.dragUtil.minY = -offsetX/2;
					this.dragUtil.maxX = $parent.innerWidth() - offsetX/2;
					this.dragUtil.maxY = $parent.innerHeight() - offsetY/2;
				}else{
					this.dragUtil.minX = 0;
					this.dragUtil.minY = 0;
					this.dragUtil.maxX = $parent.innerWidth() - offsetX;
					this.dragUtil.maxY = $parent.innerHeight() - offsetY;
				}
				
				// 사용자가 지정한 값이 있는 경우
				if(!isNaN(this.minX) && this.minX !== null) this.dragUtil.minX = this.minX;
				if(!isNaN(this.minY) && this.minY !== null) this.dragUtil.minY = this.minY;
				if(!isNaN(this.maxX) && this.maxX !== null) this.dragUtil.maxX = this.maxX;
				if(!isNaN(this.maxY) && this.maxY !== null) this.dragUtil.maxY = this.maxY;
				
				//console.log($parent.innerWidth(), offsetX);
			},

			// 드래그 허용 범위내의 값으로 변환
			_checkLimit : function (x,y){
				//console.log(x,y,this.dragUtil.maxX, this.dragUtil.maxY);
				if(this.dragUtil.minX > x) x = this.dragUtil.minX;
				if(this.dragUtil.maxX < x) x = this.dragUtil.maxX;
				
				if(this.dragUtil.minY > y) y = this.dragUtil.minY;
				if(this.dragUtil.maxY < y) y = this.dragUtil.maxY;
				
				return {x:x, y:y};
			}

			////////////////////////////////
			// Prototype END
			////////////////////////////////
			// _factory  end
		};


		////////////////////////////////////////
		// END
		////////////////////////////////////////

		// 서비스 객체 리턴
		return Drager;
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

