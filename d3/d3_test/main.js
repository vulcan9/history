

var w = 300, h = 150;

var container = d3.select("#container");

function newSvg(title, width, height) {

    w = width || 300;
    h = height || 150;

	var svg = container.append("svg")
	.attr({ width: w, height: h })
	.style("border", "1px dashed black");

	if (!title) return svg;
	svg.append("text").text(title)
		.attr("y", 20);

	return svg;
}


// test 01
test01("part 2. 10.Creating SVG Elements Based on Data");
function test01(title) {
	var svg = newSvg(title);

	var data = [40, 20, 10];
	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle");

	circles.attr({ cx: w / 2, cy: h / 2 })
		.attr("r", function (d) {
			return d;
		})
		.style("fill", function (d, i) {
			if (d == 40) {
				color = "green";
			} else if (d == 20) {
				color = "popule"
			} else {
				color = "red"
			}
			return color;
		});
};



// test 02
test02("part 2. 11.Using the SVG Coordinate Space");
function test02(title) {
	var svg = newSvg(title);

	var data = [30, 70, 110];
	var circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle");

	circles.attr("cx", function (d) {
		return d;
	})
		.attr("cy", function (d) {
			return d;
		})
		.attr("r", function (d) {
			return 20;
		})
		.style("fill", function (d, i) {
			if (d == 30) {
				color = "green";
			} else if (d == 70) {
				color = "popule"
			} else {
				color = "red"
			}
			return color;
		});
};



// test 03
test03("part 2. 12.Data Structures D3.js Accepts");
function test03(title) {
	var svg = newSvg(title);

	var data = [30, 70, 110];
	var text = svg.selectAll("text")
		.data(data)
		.enter()
		.append("text");

	// enter() 실행으로 인해 현재 text는 생로 생성되는 2개의 text element 만을 가지고 있다.
	// 첫째항목까지 text를 적용하려면 다시 select해야 한다.

	//text = svg.selectAll("text")

	text.text(function (d, i) {
		return "i = " + i + ", d = " + d;
	})
	.attr("x", function (d, i) {
		return 50;
	})
	.attr("y", function (d, i) {
		return (i + 1) * 20;
	});
};


/*
// * Loading External Data Resources (함수로 builtin 되어있음)
	- an XMLHttpRequest
	- a text file
	- a JSON blob
	- an HTML document fragment
	- an XML document fragment
	- a comma-separated values (CSV) file
	- a tab-separated values (TSV) file
*/

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
	var svg = new newSvg(title);

	svg.append("circle").attr({ cx: 25, cy: 55, r: 25 }).style("fill", "purple");
	svg.append("rect").attr({ x: 50, y: 30, width: 50, height: 50 }).style("fill", "green");
	svg.append("ellipse").attr({ cx: 115, cy: 55, rx: 15, ry: 25 }).style("fill", "red");
	svg.append("line").attr({ x1: 130, y1: 55, x2: 155, y2: 55 }).style({ "stroke": "gray", "stroke-width": 5 });

	svg.append("polyline").attr("points", "05,100 15,100 15,110 25,110 25,120 35,120")
		.style({ "stroke": "blue", "stroke-width": 2, "fill": "none" });
	svg.append("polygon").attr("points", "55,110 65,90 75,110")
		.style({ "stroke": "blue", "stroke-width": 2, "fill": "yellow" });
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
	var svg = new newSvg(title);

	// 아래 두가지 표기 모두 맞음
	// M10,25L10,75L60,75L10,25
	// M 10 25 L 10 75 L 60 75 L 10 25

	// path 1
	svg.append("path").attr("d", "M 10 25 L 10 75 L 60 75 L 10 25")
		.style({ "stroke": "red", "stroke-width": 2, "fill": "none" });

	// path 2

	/*
	// D3.js Path Data Generators

	d3.svg.line - create a new line generator
	d3.svg.line.radial - create a new radial line generator
	d3.svg.area - create a new area generator
	d3.svg.area.radial - create a new radial area generator
	d3.svg.arc - create a new arc generator
	d3.svg.symbol - create a new symbol generator
	d3.svg.chord - create a new chord generator
	d3.svg.diagonal - create a new diagonal generator
	d3.svg.diagonal.radial - create a new radial diagonal generator
	*/

	var data = [
		{ x: 100, y: 35 }, { x: 120, y: 50 }, { x: 140, y: 40 },
		{ x: 160, y: 70 }, { x: 180, y: 35 }, { x: 200, y: 90 }
	];

	var lineFunction = d3.svg.line()
		.x(function (d) { return d.x; })
		.y(function (d) { return d.y; })
		.interpolate("linear");
	/*
	* d3.js가 제공하는 interpolate 11가지 type
	linear, step-before, step-after, basis, basis-open, basis-closed, 
	bundle, cardinal, cardinal - open, cardinal - closed, monotone
	*/

	var pathData = lineFunction(data);
	svg.append("path").attr("d", pathData)
		.style({ "stroke": "red", "stroke-width": 2, "fill": "none" });

	/* 생성된 결과
	<path style="stroke: rgb(255, 0, 0); stroke-width: 2px; fill: none;"
		d="M100,35L120,50L140,40L160,70L180,35L200,90"></path>
	*/
};

test06("16. Dynamic SVG Coordinate Space");

function test06(title) {
    var data = [
        { "x_axis": 10, "y_axis": 10, "height": 20, "width":20, "color" : "green" },
        { "x_axis": 160, "y_axis": 40, "height": 20, "width": 20, "color": "purple" },
        { "x_axis": 70, "y_axis": 70, "height": 20, "width": 20, "color": "red" }
    ];

    var svg = newSvg(title, 150, 100);
    var rect = svg.selectAll("rect")
        .data(data).enter().append("rect");

    var attr = rect.attr("x", function (d) { return d.x_axis; })
        .attr("y", function (d) { return d.y_axis; })
        .attr("height", function (d) { return d.height; })
        .attr("width", function (d) { return d.width; })
        .style("fill", function (d) { return d.color; });

    // 현재 두번째 purple 사각형은 viewport 범위 밖에 위치하고 있다.

    // D3.js Scales
    var initialScaleData = [0, 1000, 3000, 2000, 5000, 4000, 7000, 6000, 9000, 8000, 10000];
    var scale = d3.scale.linear()
        .domain([0, 10000])
        .range([0, 100]);

    out("scale : ", scale(10));
    out("max : ", d3.max(initialScaleData));
    out("min : ", d3.min(initialScaleData));

    var newScaledData = [];
    for (var i = 0; i < initialScaleData.length; i++) {
        newScaledData[i] = scale(initialScaleData[i]);
    }
    out("scaled data : ", newScaledData);
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
    var data = [
        { "x_axis": 10, "y_axis": 10, "height": 20, "width": 20, "color": "green" },
        { "x_axis": 160, "y_axis": 40, "height": 20, "width": 20, "color": "purple" },
        { "x_axis": 70, "y_axis": 70, "height": 20, "width": 20, "color": "red" }
    ];

    var svg = newSvg(title, 150, 100);
    var rect = svg.selectAll("rect")
        .data(data).enter().append("rect");

    // 현재 두번째 purple 사각형은 viewport 범위 밖에 위치하고 있다.
    // scale 조정으로 모든 객체를 화면에 보이도록 수정한다.

    // max : x_axis + width
    var scale = d3.scale.linear()
        .domain([0, 180])
        .range([0, w]);

    var attr = rect.attr("x", function (d) { return scale(d.x_axis); })
        .attr("y", function (d) { return d.y_axis; })
        .attr("height", function (d) { return d.height; })
        .attr("width", function (d) { return scale(d.width); })
        .style("fill", function (d) { return d.color; });

}

test08("18. SVG Group Element and D3.js");

function test08(title){
    var circleData = [
        { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
        { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
    ];
    
    var rectangleData = [
        { "rx": 110, "ry": 110, "height": 30, "width": 30, "color": "blue" },
        { "rx": 160, "ry": 160, "height": 30, "width": 30, "color": "red" }
    ];

    var svg = newSvg(title);

    var circleGroup = svg.append("g").attr("transform", "translate(80,0)");
    var circles = circleGroup.selectAll("circle")
        .data(circleData)
        .enter()
        .append("circle").attr("id", function (d) { return "id_"+d.cx});

    circles.attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .attr("r", function (d) { return d.radius; })
        .style("fill", function (d) { return d.color; });

    var newGroup = svg.append("g");

    //circles = d3.selectAll("circle").
    //newGroup.insert("div", ":first-child");

    var id_20 = svg.select("#id_20");

    newGroup.append("#id_20");
}
