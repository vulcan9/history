

var w = 300, h = 200;

var container = d3.select("#container");
var svg = container.append("svg")
	.attr({width: w, height: h })
	.style("border", "1px dashed black");


/* 
// test 01
var circleData = [40,20,10];
var circles = svg.selectAll("circle")
	.data(circleData)
	.enter()
	.append("circle");

circles.attr({ cx: w/2, cy: h/2 })
	.attr("r", function (d) {
		return d;
	})
	.style("fill", function (d, i) {
		if(d == 40){
			color = "green";
		}else if(d == 20){
			color = "popule"
		} else {
			color = "red"
		}
		return color;
	});
*/

// test 02
var circleData = [30, 70, 110];
var circles = svg.selectAll("circle")
	.data(circleData)
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










