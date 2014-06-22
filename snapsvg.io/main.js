
/*
http://snapsvg.io/start/
*/

function out(){
	console.log.apply(window.console, arguments);
}

if(!Snap){
	alert("svg not support!");
	return;
}

var s;
main();

////////////////////////////////
// SVG Application 시작
////////////////////////////////

function main(){
	
	if(s){
		s.clear();
	}else{
		//var dom = document.getElementById("#svg");
		//var s = Snap(dom);
		s = Snap("#svg");
	}
	
	// 1
	s.attr({width:500,height:300});
	
	// 2
	// 원 생성
	var bigCircle = s.circle(150, 150, 100);
	
	bigCircle.attr({
		fill: "#bada55",
		stroke: "#000",
		strokeWidth: 5
	});
	
	// 3
	// 다른 원 생성
	var smallCircle = s.circle(100, 150, 70);
	
	// 4
	// group을 생성하고 새로 생성한 또 다른 원과 함께 append함
	var discs = s.group(smallCircle, s.circle(200, 150, 70));
	
	// 5
	// group 속성 변경
	discs.attr({
		fill: "#fff"
	});
	
	// 6
	// 큰 원의 mask로 group el을 지정
	bigCircle.attr({
		mask: discs
	});
	
	// 7
	// 작은원 애니메이션 (- )마스크 계속 유지됨)
	smallCircle.animate({r: 50}, 1000);
	
	// 8
	// group 내 두번째 작은원을 애니메이션
	discs.select("circle:nth-child(2)").animate({r: 50}, 1000);
	
	// 9
	// Now lets create pattern
	var p = s.path("M10-5-10,15M15,0,0,15M0-5-20,15")
		.attr({
			fill: "none",
			stroke: "#bada55",
			strokeWidth: 5
		});

	// 10
	// To create pattern,
	// just specify dimensions in pattern method:
	p = p.pattern(0, 0, 10, 10);
	// Then use it as a fill on big circle
	bigCircle.attr({
		fill: p
	});
	
	/*
	// 11
	// We could also grab pattern from SVG
	// already embedded into our page
	// pattern 재사용 (확인되지 않아 주석 처리함)
	discs.attr({
		fill: Snap("#pattern")
	});
	*/
	
	// 12
	// Lets change fill of circles to gradient
	// This string means relative radial gradient
	// from white to black
	discs.attr({fill: "r()#fff-#000"});
	// Note that you have two gradients for each circle
	
	// 13
	// Note that you have two gradients for each circle
	// If we want them to share one gradient,
	// we need to use absolute gradient with capital R
	discs.attr({fill: "R(150, 150, 100)#fff-#000"});
	
	// 14.
	// Of course we could animate color as well
	p.select("path").animate({stroke: "#f00"}, 1000);
	
	/*
	// 15.
	// Now lets load external SVG file:
	Snap.load("mascot.svg", function (f) {
		// Note that we traversre and change attr before SVG
		// is even added to the page
		f.select("polygon[fill='#09B39C']").attr({fill: "#bada55"});
		g = f.select("g");
		s.append(g);
		// Making croc draggable. Go ahead drag it around!
		g.drag();
		// Obviously drag could take event handlers too
		// Looks like our croc is made from more than one polygon...
	});
	*/
	
	// 아래 텍스트 확인 안됨
	
	// 17.
	// Writing text as simple as:
	// HTML DOM 상의 CSS font-size의 영향을 받음
	s.text(200, 200, "Snap.svg")
	  .attr({
		"font-size": "10px"
	  });
	
	// 18.
	// Provide an array of strings (or arrays), to generate tspans
	var t = s.text(300, 220, ["Snap", ".", "svg"])
	  .attr({
		"font-size": "20px"
	  });
	  
	t.selectAll("tspan:nth-child(3)")
	  .attr({
		fill: "#900",
		"font-size": "20px"
	  });
	
	
	
	
	
	
	
	
	
}












/*
var paper;

function main(){
	if(paper){
		// 모두 지우기
		paper.clear();
	}else{
		// 그리기 영역 생성 300 × 200 at 10, 50
		var p = document.getElementById("canvasView");
	    paper = createStage(p);
	}
	
	
	
	addWorkspace(paper);
	return;
	setSize(paper, 200, 200);
	
	
	
	var el01 = addElement({
			type: "rect",
			x: 10,
			y: 10,
			width: 25,
			height: 25,
			stroke: "#f00"
		}, "rect01");
	// el.x, el.y, el.width, el.height 은 별도로 정의하여 참조 해야 한다.
	// 안티얼라이싱 때문에 0.5 ~ 1씩 보정되었기 때문
	out(el01);
	
	
	var el02 = paper.rect(40, 10, 25, 25)
	.attr({
		stroke: "#f00"
		
	});
	out(el02);
	
	
	setStageSize(500, 300);
	
	out("--------------------------------");
	out("// 종료");
    out("--------------------------------");
}
	

////////////////////////////////
// Method
////////////////////////////////

// 그리기 영역 생성
function createStage(){
	//var paper = Raphael(x, y, w, h);
	var paper = Raphael.apply(this, arguments);
	
	// 최초 작업 공간을 생성
	addPage(paper);
	
	return paper;
}

//-------------------------	
// workspace
//-------------------------

// 내부에서 page를 생성하면서 계속 확장된다.
// 내부에 3개의 레이어로 구성된다.
function addPage(parent){
	addUnderspace(parent);
	addWorkspace(parent);
	addWatermark(parent);
}

// workspace는 <g>로 묶어서 관리한다.
function addWorkspace(parent){
	addContainer(parent);
}

// paper의 테두리, background image, master 등을 그리는 공간<g>.
function addUnderspace(){
	
}

// 워터마크 등을 생성하는 공간<g>
function addWatermark(paper){
	
}

// 가이드라인, 룰러, 편집창등의 도구들이 나타나는 공간<g>
function addToolspace(){
	
}







// stage 크기 재설정
function setSize(el, w, h){
	paper.setSize(w, h);

	//"shape-rendering": "crispEdges"
	paper.setViewBox(0.5, 0.5, paper.width, paper.height);

	// stage 테두리
	//drawStageBorder();
}

// stage 테두리
function drawStageBorder(){
	// antiAliasing 보정치(+0.5)에 의해 잘림을 방지하기위해 보정함
	var el = paper.rect(1, 1, paper.width-1, paper.height-1);
	return el;
}

//-------------------------	
// element
//-------------------------

// 추가
function addElement(data, id){
	out("data", data)
	//var el = paper.add([data])[0];
	
	var el;
	var type = (data.type).toLowerCase();
	switch(type)
	{
		case "rect":
		el = addRect(data);
	}
	
	if(!el) return null;
	
	if(id){
		//el.data("id", data["id"]);
		el.node["id"] = id;
	}
	return el;
}

// 삭제
function removeElement(data, id){
	out("data", data)
	var el = paper.add([data])[0];
	if(id){
		//el.data("id", data["id"]);
		el.node["id"] = id;
	}
	return el;
}

function addRect(data){
	//var el = paper.rect(data.x+0.5, data.y+0.5, data.width-1, data.height-1);
	var el = paper.rect(data.x, data.y, data.width, data.height);
	delete data.x;delete data.y;delete data.width;delete data.height;
	el.attr(data);
	return el;
};
*/



































	/*
	// 원 그리기
	// Creates circle at x = 50, y = 50, with radius 50
	var circle = paper.circle(100, 100, 50)
	    .attr({
			"fill":"#000",
			"stroke":"#00D",
			"stroke-width":5
		});
		
	// 애니메이션
	circle.click(function (){
		// this : circle
		out("click", arguments);
		this.animate({
			"fill":"orange",
			"stroke":"#DDD"
		}, 500, "ease-in", function (){
			// this : circle
			out("complete : ", arguments);
		});
	});
	*/
	
	
	/*
	// element 추가 방법 (json)
	paper.add([
		{
			type: "rect",
			x: 10,
			y: 10,
			width: 25,
			height: 25,
			id: "rect01",
			stroke: "#f00"
		}, {
			type: "text",
			x: 30,
			y: 40,
			id: "text01",
			text: "Dump"
		}
	]);
	*/
