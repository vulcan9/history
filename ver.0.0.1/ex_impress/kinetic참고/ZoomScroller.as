////////////////////////////////////////////////////
//
//  @Project : Whisper Project
//  @Company : FDESK Inc. (www.fdesk.net)
//  @Author : Park Dong-il (pdi1066@naver.com)
//
////////////////////////////////////////////////////

package com.fdesk.whisper.components.scroller
{
	import flash.display.DisplayObject;
	import flash.display.InteractiveObject;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	import mx.core.mx_internal;
	import mx.events.TouchInteractionEvent;
	
	use namespace mx_internal;
	
	public class ZoomScroller extends MScroller
	{
		public function ZoomScroller()
		{
			super();
			this.addEventListener(Event.ADDED_TO_STAGE, onAddToStage);
			this.addEventListener(Event.REMOVED_FROM_STAGE, onRemovedFromStage);
		}
		
		//****************************************************************************
		// bug : 2012.07.10
		// 컴포넌트형 샘플과 같이 viewBase에서 돌아가는 경우 이벤트가 누적되는 경우가 생기므로 아래와 같이 처리한다.
		
		protected function onAddToStage(event:Event):void
		{
			installTouchListeners();
		}
		
		protected function onRemovedFromStage(event:Event):void
		{
			uninstallTouchListeners();
		}
		
		//****************************************************************************
		
		//****************************************************************************
		// bug : 2012.06.14
		
		// PageTouchDispatcher.instance 로부터 마우스 이벤트를 받도록 한다. - 취소
		// 그렇지않으면 Zoom 상태에서 스크롤이 생겼을때 Element의 마우스 이벤트와 겹치는 현상이 발생한다
		// (Element의 드래그와 겹치면 Element 드래그 + 화면 이동 현상이 생긴다.)
		
		// bug : 20120619
		// capture 단계 이벤트 활용할 수 없으므로 PageTouchDispatcher 사용안함
		// 스크롤 이동과 페이지내 Element의 드래그 기능 충돌을 막기위해 mouseDownHandler Override 함
		
		//****************************************************************************
		
		override protected function installTouchListeners():void
		{
			//addEventListener(TouchInteractionEvent.TOUCH_INTERACTION_STARTING, touchInteractionStartingHandler1, true);
			addEventListener(TouchInteractionEvent.TOUCH_INTERACTION_STARTING, touchInteractionStartingHandler);
			addEventListener(TouchInteractionEvent.TOUCH_INTERACTION_START, touchInteractionStartHandler);
			addEventListener(TouchInteractionEvent.TOUCH_INTERACTION_END, touchInteractionEndHandler);
			
			// capture mouse listeners to help block click and mousedown events.
			// mousedown is blocked when a scroll is in progress
			// click is blocked when a scroll is in progress (or just finished)
			
			
			addEventListener(MouseEvent.CLICK, touchScrolling_captureMouseHandler, true);
			addEventListener(MouseEvent.MOUSE_DOWN, mouseDownHandler, false, 100);
			addEventListener(MouseEvent.MOUSE_DOWN, touchScrolling_captureMouseHandler, true);
			
			/*
			PageTouchDispatcher.instance.addEventListener(PageTouchEvent.TOUCH_CLICK, onMouseClickHandler);
			PageTouchDispatcher.instance.addEventListener(PageTouchEvent.TOUCH_DOWN, onMouseDownHandler);
			PageTouchDispatcher.instance.addEventListener(PageTouchEvent.TOUCH_DOWN, onMouseClickHandler);
			//*/
		}
		
		override protected function uninstallTouchListeners():void
		{
			removeEventListener(TouchInteractionEvent.TOUCH_INTERACTION_STARTING, touchInteractionStartingHandler);
			removeEventListener(TouchInteractionEvent.TOUCH_INTERACTION_START, touchInteractionStartHandler);
			removeEventListener(TouchInteractionEvent.TOUCH_INTERACTION_END, touchInteractionEndHandler);
			
			
			removeEventListener(MouseEvent.CLICK, touchScrolling_captureMouseHandler, true);
			removeEventListener(MouseEvent.MOUSE_DOWN, mouseDownHandler);
			removeEventListener(MouseEvent.MOUSE_DOWN, touchScrolling_captureMouseHandler, true);
			
			/*
			PageTouchDispatcher.instance.removeEventListener(PageTouchEvent.TOUCH_CLICK, onMouseClickHandler);
			PageTouchDispatcher.instance.removeEventListener(PageTouchEvent.TOUCH_DOWN, onMouseDownHandler);
			PageTouchDispatcher.instance.removeEventListener(PageTouchEvent.TOUCH_DOWN, onMouseClickHandler);
			//*/
		}
		
		override protected function mouseDownHandler(event:MouseEvent):void
		{
			var ar:Array = this.getObjectsUnderPoint(new Point(event.stageX, event.stageY));
			
			for each (var prop:DisplayObject in ar)
			{
				var o:InteractiveObject = prop as InteractiveObject;
				if(!o) continue;
				
				//out("o : ", o);
				//out(o.willTrigger(MouseEvent.MOUSE_MOVE), o.hasEventListener(MouseEvent.MOUSE_MOVE));
				if(o && o.willTrigger(MouseEvent.MOUSE_MOVE))
				{
					if(!horizontalScrollInProgress && !verticalScrollInProgress){
						captureNextClick = false
						return
					}
				}
			}
			
			super.mouseDownHandler(event);
		}
		
		/*
		protected function onMouseClickHandler(event:Event):void
		{
			var mouseEvent:MouseEvent;
			if(event is MouseEvent){
				mouseEvent = event as MouseEvent;
			}else if(event is PageTouchEvent){
				mouseEvent = PageTouchEvent(event).mouseEvent;
			}
			
			touchScrolling_captureMouseHandler(mouseEvent);
		}
		
		protected function onMouseDownHandler(event:Event):void
		{
			var mouseEvent:MouseEvent;
			if(event is MouseEvent){
				mouseEvent = event as MouseEvent;
			}else if(event is PageTouchEvent){
				mouseEvent = PageTouchEvent(event).mouseEvent;
			}
			
			mouseDownHandler(mouseEvent);
		}
		
		protected function onTouchScrolling_captureMouseHandler(event:Event):void
		{
			var mouseEvent:MouseEvent;
			if(event is MouseEvent){
				mouseEvent = event as MouseEvent;
			}else if(event is PageTouchEvent){
				mouseEvent = PageTouchEvent(event).mouseEvent;
			}
			
			//out("onTouchScrolling_captureMouseHandler", this.mx_internal::horizontalScrollInProgress, this.mx_internal::verticalScrollInProgress);
			touchScrolling_captureMouseHandler(mouseEvent);
		}
		*/
		////////////////////////////////
		// End
		////////////////////////////////
	}
}