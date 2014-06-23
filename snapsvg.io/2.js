
/*
http://snapsvg.io/start/
http://svg.dabbles.info/
*/

function out(){
	console.log.apply(window.console, arguments);
}

if(!Snap){
	alert("svg not support!");
	return;
}

var exampleNum = 0;
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
		s.attr({width:500,height:300});
		
		// 테두리
		var r = s.rect(0,0,500,300).attr({stroke:"#123456", strokeWidth:1, fill:"none"});
		
		s.svg(50,50,100,100, 0,0,100,100).attr({fill:"red"});
	}
	
	++exampleNum;
	run();
	
	function run(){
		var func = this["test" + exampleNum];
		var label;
		if(func != null){
			func.apply();
			label = "NEXT RUN : " + exampleNum;
			var runButton = document.getElementById("runButton");
			runButton.innerText = label;
		}else{
			exampleNum = 0;
			main();
		}
	}
}

function setTitle(str){
	var t = s.text(0,10,str).attr({fontSize:"22px"});
}

function test1(){
	setTitle("사각형 그리기");
	
	var r = s.rect(100,100,100,100,20,20).attr({
		stroke:"#123456", strokeWidth:20, fill:"red", opacity:0.2
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
