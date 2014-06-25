

var w = 300, h = 200;

var container = d3.select("#container");

function newSvg(title){
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

- polyline : points, stroke, stroke-width
<polyline fill="none" stroke="blue" stroke-width="2"
	    points="05,30 15,30 15,20 25,20 25,10 35,10" />

- polygon : points, stroke, stroke-width, fill
<polygon fill="yellow" stroke="blue" stroke-width="2"
    points="05,30 15,10 25,30" />
*/

function test04(title) {
	var svg = new newSvg(title);
};









