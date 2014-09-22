
/*	
<div id="screen">
	<div id="image"><img src="kinetic.jpg"></div>
</div>
*/

function run() {

}






// Number of mouse movements to keep in the history to calculate velocity.
var EVENT_HISTORY_LENGTH = 5;

// Minimum velocity needed to start a throw gesture, in inches per second.
var MIN_START_VELOCITY_IPS = 0.8;

// Maximum velocity of throw effect, in inches per second.
var MAX_THROW_VELOCITY_IPS = 10.0;

// 드래그 하는 동안 초당 업데이트 횟수
var MAX_DRAG_RATE = 30;

// Weights to use when calculating velocity, giving the last velocity more of a weight than the previous ones.
var VELOCITY_WEIGHTS = [1, 1.33, 1.66, 2];


// Threshold for screen distance they must move to count as a scroll
// Based on 20 pixels on a 252ppi device.
var minSlopInches = 0.079365; // 20.0/252.0
var effectiveScreenDPI = 72;
// scrollSlop - 드래그 인지 최소값
var scrollSlop = Math.round(minSlopInches * effectiveScreenDPI);


/*
This is different from mouseDownedPoint 
because the user may mousedown on one point, but a scroll isn't recognized until they move more than the slop.  
Because of this, we don't want the delta scrolled to be calculated from the mouseDowned point 
because that would look jerky the first time a scroll occurred.
*/
// slop에 의해 일어나는 실제 스크롤 지점
var scrollGestureAnchorPoint;//Point;
// 마우스 다운 지점
var mouseDownedPoint;//Point;

// 드래그중 최근 delta 좌표
var mostRecentDragDeltaX;//Number;
var mostRecentDragDeltaY;//Number;
// 드래그중 최근 시간
var mostRecentDragTime;//Number;

var dragTimer = null;//Timer
var startTime;//Number;

// Indicates that the mouse coordinates have changed and the next dragTimer invokation needs to do a scroll.
var dragScrollPending = false;

// velocity 계산에 필요함
var mouseEventCoordinatesHistory;//Vector.<Point>;
var mouseEventTimeHistory;//Vector.<int>;

// mouseEventCoordinatesHistory 아이템 개수
// Length of items in the mouseEventCoordinatesHistory and 
// timeHistory Vectors since a circular buffer is used to conserve points.
var mouseEventLength = 0;

// 스크롤 중인지 여부
var isScrolling = false;//


// This is used to disable thinning for automated testing.
var dragEventThinning = true;

function ScrollHelper(target) {
	// Vector.<Point>
	mouseEventCoordinatesHistory = new Array(EVENT_HISTORY_LENGTH);
	// Vector.<int>
	mouseEventTimeHistory = new Array(EVENT_HISTORY_LENGTH);

	$(target).on("mousedown", $.proxy(this._onMouseDown, this));
	$(target).on("dragstart", $.proxy(this._onDragStart, this));
	this.target = target;
}

ScrollHelper.prototype = {
	_onDragStart: function (e) {
		return false;
	},
	_onMouseDown: function (e) {
		$(document).on("mousemove", $.proxy(this._onMouseMove, this));
		$(document).on("mouseup", $.proxy(this._onMouseUp, this));

		this.start(e);
	},
	_onMouseMove: function (e) {
		this.move(e);
	},
	_onMouseUp: function (e) {
		$(document).off("mousemove", $.proxy(this, this._onMouseMove));
		$(document).off("mouseup", $.proxy(this, this._onMouseUp));

		this.end(e);
	},
	getTimer: function () {
		return (new Date()).getTime();
	},

	////////////////////////////
	// Start
	////////////////////////////

	start: function (mouseEvent) {
		//out("mousedown");
		startTime = this.getTimer();
		
		if (!isScrolling) {
			mouseDownedPoint = new Point(mouseEvent.clientX, mouseEvent.clientY);
		}

		// if we were already scrolling, continue scrolling
		if (isScrolling) {
			scrollGestureAnchorPoint = new Point(mouseEvent.clientX, mouseEvent.clientY);
			mouseDownedPoint = new Point(mouseEvent.clientX, mouseEvent.clientY);
		}

		// reset circular buffer index/length
		mouseEventLength = 0;
		this._addMouseEventHistory(mouseEvent.clientX, mouseEvent.clientY, this.getTimer());

		// 위치 저장
		this.capturePosition();
	},
	
	// Adds the time and mouse coordinates
	_addMouseEventHistory: function (clientX, clientY, time){
		// calculate dx, dy
		var dx = clientX - mouseDownedPoint.x;
		var dy = clientY - mouseDownedPoint.y;
			
		var currentPoint;
		var currentIndex = (mouseEventLength % EVENT_HISTORY_LENGTH);
		if (mouseEventCoordinatesHistory[currentIndex])
		{
			currentPoint = mouseEventCoordinatesHistory[currentIndex];
			currentPoint.x = dx;
			currentPoint.y = dy;
		}
		else
		{
			currentPoint = new Point(dx, dy);
			mouseEventCoordinatesHistory[currentIndex] = currentPoint;
		}

		// add time history as well
		mouseEventTimeHistory[currentIndex] = this.getTimer() - startTime;
			
		// increment current length if appropriate
		mouseEventLength++;
	},






	
	////////////////////////////
	// Move
	////////////////////////////

	move: function (event) {
		//out("mousemove");
		var mouseDownedDifference = new Point(event.clientX - mouseDownedPoint.x, event.clientY - mouseDownedPoint.y);   
		
		//out("mousemove", isScrolling);
		if (!isScrolling)
		{
			var shouldBeScrolling = false;
			if (Math.abs(mouseDownedDifference.x) >= scrollSlop) shouldBeScrolling = true;
			if (Math.abs(mouseDownedDifference.y) >= scrollSlop) shouldBeScrolling = true;
			
			if (shouldBeScrolling)
			{
				isScrolling = true;
				
				// diagonal case
				var maxAxisDistance = Math.max(Math.abs(mouseDownedDifference.x),Math.abs(mouseDownedDifference.y));
				if (maxAxisDistance >= scrollSlop)
				{
					var scrollAnchorDiffX;
					var scrollAnchorDiffY;
					
					// The anchor point is the point at which the line described by mouseDownedDifference
					// intersects with the perimeter of the slop area.  The slop area is a square with sides
					// of length scrollSlop*2. 
					var normalizedDiff = mouseDownedDifference.clone();
					
					// Use the ratio of scrollSlop to maxAxisDistance to determine the length of the line
					// from the mouse down point to the anchor point.
					var lineLength = (scrollSlop / maxAxisDistance) * mouseDownedDifference.length;  
					
					// Normalize to create a line of that length with the same angle it had before.
					normalizedDiff.normalize(lineLength);
					
					// 4 possibilities: top-right, top-left, bottom-right, bottom-left
					scrollAnchorDiffX = Math.round(normalizedDiff.x);
					scrollAnchorDiffY = Math.round(normalizedDiff.y);
					
					scrollGestureAnchorPoint = new Point(mouseDownedPoint.x + scrollAnchorDiffX, mouseDownedPoint.y + scrollAnchorDiffY);
				}
			}
		}
		
		// if we are scrolling (even if we just started scrolling)
		if (isScrolling)
		{
			// calculate the delta
			var xMove = event.clientX - scrollGestureAnchorPoint.x;
			var yMove = event.clientY - scrollGestureAnchorPoint.y;
			
			if (!dragTimer){
				dragTimer = new Timer(1000 / MAX_DRAG_RATE, this._dragTimerHandler, this);
			}
			
			if (!dragTimer.running)
			{
				// The drag timer is not running, so we record the event and scroll the content immediately.
				this._addMouseEventHistory(event.clientX, event.clientY, this.getTimer());

				out("이동 : ", xMove, yMove);
				this.performDrag(xMove, yMove);
				
				// If event thinning is not enabled, we never start the timer so all subsequent
				// move event will continue to be handled right in this function.
				dragEventThinning = true;
				if (dragEventThinning)
				{
					dragTimer.start();
					// No additional mouse events received yet, so no scrolling pending.
					dragScrollPending = false;
				}
			}
			else
			{
				mostRecentDragDeltaX = xMove;
				mostRecentDragDeltaY = yMove;
				mostRecentDragTime = this.getTimer();
				dragScrollPending = true;
			}
		}
	},
	
	_dragTimerHandler: function (event){
		if (dragScrollPending){
			dragScrollPending = false;

			// A scroll is pending, so record the mouse deltas and scroll the content. 
			this._addMouseEventHistory(
				mostRecentDragDeltaX + scrollGestureAnchorPoint.x,
				mostRecentDragDeltaY + scrollGestureAnchorPoint.y, mostRecentDragTime);

			out("이동(Timer) : ", mostRecentDragDeltaX, mostRecentDragDeltaY);
			this.performDrag(mostRecentDragDeltaX, mostRecentDragDeltaY);
		}
		else
		{
			// The timer elapsed with no mouse events, so we'll just turn the timer off for now.
			// It will get turned back on if another mouse event comes in.
			dragTimer.stop();
		}
	},

	capturePosition: function () {
		$target = $(this.target);
		var x = this.getPureNumber($target.css("left"));
		var y = this.getPureNumber($target.css("top"));

		if (!this._capturePoint) this._capturePoint = new Point(x, y);
		this._capturePoint.x = x;
		this._capturePoint.y = y;
	},

	// dragX, dragY : 누적 이동량
	performDrag: function (xMove, yMove) {
		var x = this._capturePoint.x + xMove;
		var y = this._capturePoint.y + yMove;
		$target = $(this.target);
		$target.css({ "left": x, "top": y });
	},

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

	////////////////////////////
	// End
	////////////////////////////

	end: function (event) {
		if (!isScrolling) return;
			
		if (dragTimer){
			if (dragScrollPending){
				// A scroll is pending, so record the mouse deltas and scroll the content.
				this._addMouseEventHistory(
					mostRecentDragDeltaX + scrollGestureAnchorPoint.x,
					mostRecentDragDeltaY + scrollGestureAnchorPoint.y, mostRecentDragTime);

				this.performDrag(mostRecentDragDeltaX, mostRecentDragDeltaY);
			}
			
			// The drag gesture is over, so we no longer need the timer.
			dragTimer.stop();
			dragTimer = null;
		}
		
		if (event){
			this._addMouseEventHistory(event.clientX, event.clientY, this.getTimer());
		}
			
		// decide about throw
		var currentTime = this.getTimer();
		
		// calculate average time b/w events and see if the last two (mouseMove and this mouseUp) 
		// were far apart.  If they were, then don't do anything if the velocity of them is small.
		var averageDt = 0;
		var len = (mouseEventLength > EVENT_HISTORY_LENGTH ? EVENT_HISTORY_LENGTH : mouseEventLength);
		
		// if haven't wrapped around, then startIndex = 0.  If we've wrapped around, 
		// then startIndex = mouseEventLength % EVENT_HISTORY_LENGTH.  The equation 
		// below handles both of those cases
		const startIndex = ((mouseEventLength - len) % EVENT_HISTORY_LENGTH);
		const endIndex = ((mouseEventLength - 1) % EVENT_HISTORY_LENGTH);
		
		// gauranteed to have 2 mouse events b/c atleast a mousedown and a mousemove 
		// because if there was no mousemove, we definitely would not be scrolling and 
		// would have exited this function earlier
		var currentIndex = startIndex;
		while (currentIndex != endIndex)
		{
			// calculate nextIndex here so we can use it in the calculations
			var nextIndex = ((currentIndex + 1) % EVENT_HISTORY_LENGTH);
			
			averageDt += mouseEventTimeHistory[nextIndex] - mouseEventTimeHistory[currentIndex];
			currentIndex = nextIndex;
		}
		averageDt /= len-1;
		
		var minVelocityPixels = MIN_START_VELOCITY_IPS * effectiveScreenDPI / 1000;
		
		// calculate the velocity using a weighted average
		var throwVelocity = this.calculateThrowVelocity();
			
		// Also calculate the effective velocity for the final 100ms of the drag.
		var finalDragVel = this.calculateFinalDragVelocity(100);
			
		if (throwVelocity.length <= minVelocityPixels)
		{
			throwVelocity.x = 0;
			throwVelocity.y = 0;
		}
			
		// If the gesture appears to have slowed or stopped prior to the mouse up, 
		// then force the velocity to zero.
		// Compare the final 100ms of the drag to the minimum value. 
		if ( finalDragVel.length <= minVelocityPixels)
		{
			throwVelocity.x = 0;
			throwVelocity.y = 0;
		}
	},
	
	calculateThrowVelocity: function ()
	{
		var len = (mouseEventLength > EVENT_HISTORY_LENGTH ? EVENT_HISTORY_LENGTH : mouseEventLength);
			
		// we are guarenteed to have 2 items here b/c of mouseDown and a mouseMove
			
		// if haven't wrapped around, then startIndex = 0.  If we've wrapped around, 
		// then startIndex = mouseEventLength % EVENT_HISTORY_LENGTH.  The equation 
		// below handles both of those cases
		const startIndex = ((mouseEventLength - len) % EVENT_HISTORY_LENGTH);
		const endIndex = ((mouseEventLength - 1) % EVENT_HISTORY_LENGTH);
			
		// variables to store a running average
		var weightedSumX = 0;
		var weightedSumY = 0;
		var totalWeight = 0;
			
		var currentIndex = startIndex;
		var i = 0;
		while (currentIndex != endIndex)
		{
			// calculate nextIndex early so we can re-use it for these calculations
			var nextIndex = ((currentIndex + 1) % EVENT_HISTORY_LENGTH);
				
			// Get dx, dy, and dt
			var dt = mouseEventTimeHistory[nextIndex] - mouseEventTimeHistory[currentIndex];
			var dx = mouseEventCoordinatesHistory[nextIndex].x - mouseEventCoordinatesHistory[currentIndex].x;
			var dy = mouseEventCoordinatesHistory[nextIndex].y - mouseEventCoordinatesHistory[currentIndex].y;
				
			if (dt != 0)
			{
				// calculate a weighted sum for velocities
				weightedSumX += (dx/dt) * VELOCITY_WEIGHTS[i];
				weightedSumY += (dy/dt) * VELOCITY_WEIGHTS[i];
				totalWeight += VELOCITY_WEIGHTS[i];
			}
				
			currentIndex = nextIndex;
			i++;
		}
			
		if (totalWeight == 0)
			return new Point(0,0);
			
		// Limit the velocity to an absolute maximum
		var maxPixelsPerMS = MAX_THROW_VELOCITY_IPS * effectiveScreenDPI / 1000;
		var velX = Math.min(maxPixelsPerMS,Math.max(-maxPixelsPerMS,weightedSumX/totalWeight));
		var velY = Math.min(maxPixelsPerMS,Math.max(-maxPixelsPerMS,weightedSumY/totalWeight));
			
		return new Point(velX,velY);
	},
		
	calculateFinalDragVelocity: function (time)
	{
		// This function is similar to calculateThrowVelocity with the 
		// following differences:
		// 1) It iterates backwards through the mouse events.
		// 2) It stops when the specified amount of time is accounted for.
		// 3) It calculates the velocities from the overall deltas with no
		//    weighting or averaging. 
			
		// Find the range of mouse events to consider
		var len = (mouseEventLength > EVENT_HISTORY_LENGTH ? EVENT_HISTORY_LENGTH : mouseEventLength);
		const startIndex = ((mouseEventLength - len) % EVENT_HISTORY_LENGTH);
		const endIndex = ((mouseEventLength - 1) % EVENT_HISTORY_LENGTH);
			
		// We're going to start at the last event of the drag and iterate backward toward the first.
		var currentIndex = endIndex;
			
		var dt = 0;
		var dx = 0;
		var dy = 0;
			
		// Loop until we've accounted for the desired amount of time or run out of events. 
		while (time > 0 && currentIndex != startIndex)
		{
			// Find the index of the previous event
			var previousIndex = currentIndex - 1;
			if (previousIndex < 0)
				previousIndex += EVENT_HISTORY_LENGTH; 
				
			// Calculate time and position deltas between the two events
			var _dt = mouseEventTimeHistory[currentIndex] - mouseEventTimeHistory[previousIndex];
			var _dx = mouseEventCoordinatesHistory[currentIndex].x - mouseEventCoordinatesHistory[previousIndex].x;
			var _dy = mouseEventCoordinatesHistory[currentIndex].y - mouseEventCoordinatesHistory[previousIndex].y;
				
			// If the deltas exceed our desired time range, interpolate by scaling them
			if (_dt > time)
			{
				var interpFraction = time/_dt;
				_dx *= interpFraction; 
				_dy *= interpFraction;
				_dt = time;
			}
				
			// Subtract the current time delta from the overall desired time range 
			time -= _dt;
				
			// Accumulate the deltas
			dt += _dt;
			dx += _dx;
			dy += _dy;
				
			// Go to the previous event in the drag
			currentIndex = previousIndex;
		}
			
		if (dt == 0)
			return new Point(0,0);
			
		// Create the point representing the velocity values.
		return new Point(dx/dt,dy/dt);
	}
		
		
}
	










////////////////////////////
// Point
////////////////////////////

function Point(x, y) {
	this.x = x;
	this.y = y;
	this.length = this._getLength();
}
Point.prototype = {
	// (0,0)에서 이 점까지 연결한 선분의 길이입니다.
	_getLength: function () {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	},
	clone: function () {
		return new Point(this.x, this.y);
	},
	// (0,0)과 현재 포인트 사이의 선분을 설정된 길이로 조절합니다.
	normalize: function (thickness) {
		var ratio = thickness/this.length;
		this.x = ratio * this.x;
		this.y = ratio * this.y;
	}
}

////////////////////////////
// Timer
////////////////////////////

// http://abcoder.com/javascript/core_javascript/javascript_timer

function Timer(interval, callback, context) {
	// 타이머 이벤트 사이의 밀리초 단위 지연 시간입니다.
	this.delay = interval;
	this.running = false;
	this.callback = callback;
	this.context = context;
	this._intervalID = null;
}
Timer.prototype = {
	start: function () {
		var self = this;
		this.running = true;
		this._intervalID = setInterval(function () {
			self.callback.apply(self.context);
		}, this.delay)
	},
	stop: function () {
		if (this._intervalID) {
			clearInterval(this._intervalID);
		}
		this.running = false;
	}
}











var target = document.getElementById("target");
app = new ScrollHelper(target);













