

function out(){
	console.log.apply(window.console, arguments);
}

if(!Snap){
	alert("snap.svg not support!");
	return;
}

var exampleNum = 0;
var svg;
var width = 500, height = 200;
//main();

////////////////////////////////
// SVG Application 시작
////////////////////////////////

function main(title, w, h){
    /*
    if(svg){
        svg.clear();
	}else{
        svg = newSvg();
	}
	*/
    
    title = ++exampleNum + ". " + title;
	run();
	
	function run(){
		var func = this["test" + exampleNum];
		var label;
		if(func != null){
		    func.apply(null, [title, w, h]);
			label = "NEXT RUN : " + exampleNum;
			var runButton = document.getElementById("runButton");
			runButton.innerText = label;
		}else{
			//exampleNum = 0;
			//main();
		}
	}
}

//****************************************
// bug

// 여러개의 svg가 삽입되는 경우 
// 각 svg 에 마우스 이벤트가 잘 전달되지 않는 현상이 있음

//****************************************

function newSvg(title){

    if(svg == undefined){
        // 다른 svg element를 삽입
        var dom = document.getElementById("canvasView");
        dom.innerHTML = "<svg></svg>";
        var svgNode = dom.firstChild;
    
        //var svg = Snap(width, height);
        svg = Snap(svgNode);
        svg.attr({width:width, height:height});
        var h = 0;
    }else{
        var h = exampleNum * height;
        svg.attr({width:width, height:h});
    }
    
    // 새로운 영역 생성
    var g1 = svg.g();
	
    // 테두리
    var r = g1.rect(0,0,width,height)
        .attr({
            stroke:"#123456", strokeWidth:1, fill:"white",
            strokeDasharray: "10 10 10 10 10",
            strokeDashoffset: 10
        });

    // 제목
    setTitle(title, g1);

    // 예제 영역
    var g = setCanvas(g1);
    
    /*
    Snap.animate(0,400, function( value ){ 
        r.attr({ 'strokeDashoffset': value })
    },5000 );
    */
    
    // 역순으로 정렬
    var gList = Snap.selectAll("svg g");
    var ar = [];
    gList.forEach(function(item, i){
        if(item.parent() != svg) return;
        ar.unshift(item);
    });
    ar.forEach(function(item, i){
        item.transform("T0," + i * height);
    });
    
    return g1;
}

function setTitle(title, el){
    var svg = el || svg;
    var t = svg.text(0,10, title).attr({y:"12", fontSize:"12"});
    //var g = svg.g(t);
    //g.append(t);
}

// stroke-width/2 px씩 이동 시켜야 Antialising이 해결된다.
function setCanvas(svg, w, h){
    w = w || width;
    h = h || height;

    // 테두리
    var padding = 10;
    var y = 12;
    var rect = svg.rect(0, 0,w-padding*2,h-padding*2 - y)
        .attr({stroke:"#123456", strokeWidth:1, fill:"none"})
        .transform("translate(10,22)");

    // 그룹
    var g = svg.g();
    //g.attr("transform", "translate(" + padding + ", " + (padding + y) +")");
    g.transform("translate(10,22)");
    
    // 마스크 (white 이외의 색은 색상에 따라 alpha값 적용됨)
    var mask = rect.clone().attr({fill:"white"})
        .transform("T0,0");
       
    g.attr({mask:mask});

    return g;
}

/////////////////////////////////////////
// test
/////////////////////////////////////////

//----------------------------
main("Basics");
//----------------------------

function test1(title, w, h){
    var g = newSvg(title, w, h).select("g");
	
	var r = g.rect(10,10,100,100,20,20)
        .attr({stroke:"#123456", strokeWidth:20, fill:"red", opacity:0.2});
}

//----------------------------
main("Coloring, Click");
//----------------------------

function test2(title, w, h){
    var g = newSvg(title, w, h).select("g");

    var r = g.rect(10,10,100,100)
        .attr({fill:"red", stroke:"#123456", strokeWidth:20});
    var c= g.circle(100,100,50)
        .attr({fill:"blue", stroke:"black", strokeWidth:10});

    r.click(function(){
        if(Snap.getRGB(this.attr("fill")).toString() == Snap.getRGB("red").toString()){
            this.attr("fill", "yellow");
        }else{
            this.attr("fill", "red");
        }
    });
    
    c.click(function(){
        if(Snap.getRGB(this.attr("fill")).toString() == Snap.getRGB("green").toString()){
            this.attr("fill", "blue");
        }else{
            this.attr("fill", "green");
        }
    });

    var text = g.text(200,50,"click an Element!!")
        .attr({fill:"blue", stroke:"red", strokeWidth:"1", fontSize:"32"});

    var clone = text.clone()
        .attr({stroke:"none", fontSize:"22px"})
    
    clone.node.innerHTML = "<tspan>현재 클릭되지 않음</tspan>";
    clone.append(Snap.parse("<tspan>(가려짐)</tspan>"));

    var pth = g.path("M0,80L500,0");
    clone.attr({textpath: pth});

    clone.transform("t0,100s0.7");
    //clone.transform("t0,100s0.7r45");
}

//----------------------------
main("Basic Image Display - clone, transform");
//----------------------------

/*
transform
    t=relative transform, T=absolute transform, 
    s=relative scale, S=absolute Scale,
    r=relative rotate, R=relative rotate
*/

function test3(title, w, h){
    var g = newSvg(title, w, h).select("g");
    //svg.attr("pointer-events", "none");

    var image = g.image("http://svg.dabbles.info/tux.svg", 0,0,100,100);

    var clone = image.clone();
    clone.transform("t50,50");

    var clone = image.clone();
    clone.transform("t200,40r45");
}

//----------------------------
main("embed an SVG image");
//----------------------------

function test4(title, w, h){
    var g = newSvg(title, w, h).select("g");
    //svg.attr("pointer-events", "none");

    // 이미지 로딩 시간이 거이 들지 않는다.
    var image = g.image("data:image/jpg;base64,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",
        0,0,240,150);

    var clone = image.clone();
    clone.transform("t200,40r45");

    // 이미지에 title 달기
    var title = Snap.parse('<title>롤오버 하면 보이는 툴팁</title>');
    clone.append(title);
}

//----------------------------
main("Dragging with custom handlers");
//----------------------------

function test5(title, w, h){
    var g = newSvg(title, w, h).select("g");

    var rect = g.rect(120,50,40,40);
    var move = function(dx, dy){
        var scale = 1 + dx /50;
        this.attr({
            transform: this.data("origTransform") + (this.data("origTransform")?"T":"t") + [dx, dy]
        });
    }

    var start = function(){
        this.data("origTransform", this.transform().local);
    }

    var stop = function(){
        //out("drag end--");
    };

    rect.drag(move, start, stop);

    // scale
    var moveScale = function(dx, dy){
        var scale = 1 + dx /50;
        this.attr({
            transform: this.data("origTransform") + (this.data("origTransform")?"S":"s") + scale
        });
    }

    var rect = g.rect(320,50,40,40);
    rect.drag(moveScale, start, stop);
}

//----------------------------
main("Dragging with a plugin, taking into account currentmatrix");
//----------------------------

function test6(title, w, h){
    var g = newSvg(title, w, h).select("g");

    Snap.plugin(function (Snap, Element, Paper, global){
        Element.prototype.altDrag = function(){
            this.drag(dragMove, dragStart, dragEnd);
            return this;
        };

        var dragStart = function(x, y, ey){
            this.data("ot", this.transform().local);
        };
    
        var dragMove = function(dx, dy, ey, x, y){
            var tdx, tdy;
            var snapInvMatrix = this.transform().diffMatrix.invert();
            snapInvMatrix.e = snapInvMatrix.f = 0;
            tdx = snapInvMatrix.x(dx, dy);
            tdy = snapInvMatrix.y(dx, dy);
            this.transform(this.data("ot") + "t" + [tdx, tdy]);
        };
    
        var dragEnd = function(){

        };
    });

    var r1 = g.rect(0,0,100,100).transform('t50,50').attr({ fill: "red" }).altDrag();
    r1.transform('r45');
}

//----------------------------
main("Loading SVG, Mask, Event");
//----------------------------

// Access-Control-Allow-Origin
// XMLHttpRequest cannot load http://svg.dabbles.info/Dreaming_tux.svg. 
// No 'Access-Control-Allow-Origin' header is present on the requested resource. 
// Origin 'http://localhost' is therefore not allowed access. 

function test7(title, w, h){
    var g = newSvg(title, w, h).select("g");
    var origin = g.g();
    var container = g.g();

    var tux = Snap.load("Dreaming_tux.svg", function ( loadedFragment ) { 
        origin.append( loadedFragment );
        origin.attr("visibility", "hidden");

        //***************************************
        
        // 이미지 영역은 마스킹된 영역까지 마우스 이벤트 먹히는것 같음
        
        var fobjectSVG = loadedFragment.paper.innerSVG();
        var p = Snap.parse( fobjectSVG ).select("svg")

        var clone = p.clone();
        clone.attr({width:400, height:100});
        
        var mask = g.rect(0,0,400,200).attr({fill:"white"});
        container.attr({mask:mask})
            .append(clone);
        
        container.hover( hoverover, hoverout );
        container.text(300,100, 'hover over me');

        //container.remove(loadedFragment);

        //***************************************

        // pointer-events: none 이면 이벤트 먹히지 않음
        //container.attr("pointer-events", "visible");
    } );

    var hoverover = function() { container.animate({ transform: 's2r45,150,150' }, 1000, mina.bounce ) };
    var hoverout = function() { container.animate({ transform: 's1r0,150,150' }, 1000, mina.bounce ) };
}

//----------------------------
main("Loading, dragging, transforming SVG and matrix");
//----------------------------

function test8(title, w, h){
}

//----------------------------
main("");
//----------------------------

function test9(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test10(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test11(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test12(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test13(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test14(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test15(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test16(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test17(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test18(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test19(title, w, h){
}
//----------------------------
main("");
//----------------------------

function test20(title, w, h){
}












// el.animate({transform:"t0,0 s1.35"}, 500, mina.easeinout);












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
