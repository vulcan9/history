var body = d3.select("body");
	var svg = d3.select("svg");
	var g = svg.append("g")
        .attr("id", "container");
	/*
	var h1 = body.append("h1");
	h1.text("Hello!!");

	var section = d3.selectAll("section");
	var h1 = section.append("h1");
	h1.text("Hello!!");
	
	var h1 = d3.selectAll("section")
	    .style("background", "steelblue")
		.append("h1")
		.text("Hello!");
	*/
	
	
	g.selectAll("circle")
	    .data([4, 8, 15, 16, 23, 42])

		// 부족한 element에 대한 placeholder
		.enter()
		.append("circle")

		.attr("cx", function x(d) { return d*4; })
		.attr("cy", function y(d) { return d*4; })
		.attr("r", function r(d) { return d; })
		.text(function text(d) { return d; });
		
	var circle = g.selectAll("circle")
	    .data([4, 8, 15, 16])
		
		// 남는 element에 대한 리스트
		.exit()
	    
		.style("fill", "steelblue")
		//.remove();



    var data = [
	    {name:"a", x:10, y:9},
		{name:"b", x:8, y:8},
		{name:"c", x:13, y:8},
		{name:"d", x:9, y:8},
		{name:"e", x:11, y:9}
	];
	
	var circle = svg.selectAll("circle")
	    .data(data, function key(d){ return d.name;})
		.enter()
		.append("circle")

		.attr("cx", function x(d) { return d.x*10; })
		.attr("cy", function y(d) { return d.y*10; })
		.attr("r", function r(d) { return 2.5; })
		.style("fill", "red")

	/*
	var circle = svg.selectAll("circle")
	    .data(data, function key(d){ return d.name;})
		.exit()
		.remove();
	*/

    //<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
	var rect = svg.append("rect")
		.attr("width", function(d){return 300;})
		.attr("height", function(d){return 300;})

		// antiAllise 방지
	    .attr("x", +0.5)
		.attr("y", +0.5)

	    .style("stroke-width", 1)
		.style("fill", "none")
	    .style("stroke", "rgb(0,0,0)");
