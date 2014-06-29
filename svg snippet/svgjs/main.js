function out() {
    console.log.apply(window.console, arguments);
}

/*
http://www.svgjs.com/
https://github.com/wout/svg.js
http://svgjs.com/test/
http://documentup.com/wout/svg.js
*/

var startTime = (new Date()).getTime();

var w = 300, h = 150;
var svg;





function newSvg(title, width, height) {

    w = width || 300;
    h = height || 150;

    if (SVG.supported) {
        var svg = SVG("container").fixSubPixelOffset().size(w, h)
            .style("margin-bottom", "10px");
    } else {
        alert('SVG not supported');
        return;
    }
    
    // Group
    var group = svg.group();
    // 테두리
    var rect = group.rect(w - 1, h - 1)
            .attr({ "stroke": "#000", "stroke-width": 1, "fill": "white" })
            .x(0.5).y(0.5);

    // 타이틀 : text를 삽입하는 방법은 두가지가 있음
    //var text = group.text(title).move(0, 0);
    var text = group.plain(title).move(0, 0);
    
    var contentGroup = svg.group().translate(0,20);

    return svg;
}


// 중첩된 svg 삽입하는 방법
// var nestedSVG = svg.nested();


test01("클릭 이벤트, Animation, 색상 비교");

function test01(title) {
    svg = newSvg(title);
    var group = svg.last();

    // jquery를 이용하여 접근할 수도 있다.
    //var ar = $(svg.node).find("g");

    //var rect = group.rect(100, 100).animate().fill('#f03').move(100, 100);
    var rect = group.rect(100, 100).fill('#DDD');
    var text = group.plain("도형을 클릭하세요").move(20, 20);

    group.on("click", function () {
        //out("click : ", rect.attr("fill") == (new SVG.Color('#f03')).toHex());
        var x = (rect.x() == 100) ? 0 : 100;
        var y = (rect.y() == 100) ? 0 : 100;
        var color = (rect.attr("fill") == (new SVG.Color("#f03")).toHex()) ? '#DDD' : '#f03';
        rect.animate(500, "<", 100).fill(color).move(x, y);
    });
};






















// test 02
test02("part 2. 11.Using the SVG Coordinate Space");
function test02(title) {
    //svg = newSvg(title);
};



// test 03
test03("part 2. 12.Data Structures D3.js Accepts");
function test03(title) {
    
};

// test 04
test04("part 2. 15.SVG Paths and D3.js");

/*
- circle : cx, cy, r
<circle cx="25" cy="25" r="25" fill="purple" />

- rect : x, y, width, height
<rect x="0" y="0" width="50" height="50" fill="green" />

- ellipse : cx, cy, rx, ry
<ellipse cx="25" cy="25" rx="15" ry="10" fill="red" />

- line : x1, y1, x2, y2, stroke, stroke-width
<line x1="5" y1="5" x2="40" y2="40" stroke="gray" stroke-width="5"  />

- polyline : points, stroke, stroke-width, fill(none)
<polyline fill="none" stroke="blue" stroke-width="2"
	    points="05,30 15,30 15,20 25,20 25,10 35,10" />

- polygon : points, stroke, stroke-width, fill
<polygon fill="yellow" stroke="blue" stroke-width="2"
    points="05,30 15,10 25,30" />
*/

function test04(title) {

};

// test 05
test05("15. SVG Path Example");
/*
// https://www.dashingd3js.com/svg-paths-and-d3js

// SVG Path Mini-Language
// 대소문자 구분되는 문자열(path 명령)
moveto, lineto, curveto, arc, closepath
<path stroke="red" stroke-width="2" fill="none"
	d=" M 10 25 L 10 75 L 60 75 L 10 25"/>

대문자 표기 : svg 기준 절대좌표로 인식
소문자 표기 : 상대적인 위치로 인식

- Pen Command
M(m) : x,y            // moveto

- Line Commands
L(l): x,y             // lineto
H(h): x               // horizontal lineto
V(v): y               // vertical lineto

- Cubic Bezier Curve Commands
C(c): x1 y1 x2 y2 x y // curveto
S(s): x2 y2 x y       // shorthand/smooth curveto

- Quadratic Bezier Curve Commands
Q(q): x1 y1 x y       // quadratic Bézier curveto
T(t): x y             // Shorthand/smooth quadratic Bézier curveto

- Elliptical Arc Curve Command
A(a):rx ry x-axis-rotation large-arc-flag sweep-flag x y
                      //elliptical arc

- End Path Command
Z(z): none            // closepath
*/

function test05(title) {
    
};

test06("16. Dynamic SVG Coordinate Space");

function test06(title) {
    
};

/*
The D3.js scales are:

- Identity: a special kind of linear scale, 1:1, good for pixel values. input == output
- Linear: transforms one value in the domain interval into a value in the range interval
- Power and Logarithmic scales: sqrt, pow, log – used for exponentially increasing values
- Quantize and Quantile scales: for discrete sets of unique possible values for inputs or outputs
- Ordinal: for non quantitative scales, like names, categories, etc
*/

test07("17. D3.js Scale Linear");

function test07(title) {
    

}

test08("18. SVG Group Element and D3.js");

function test08(title) {
    
}


test09("19. SVG Text Element");

function test09(title) {
    
    
}

test10("20. D3.js Axes");

function test10(title) {
    
}



var endTime = (new Date()).getTime() - startTime;
out("endTime : ", endTime);











