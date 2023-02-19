// JS File for Homework 5: Interactive Graph with D3
// Luke Abbatessa and Jocelyn Ju
// Last Modified: 02.19.2023

// create a frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#barplot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// open file for bar chart
d3.csv("data/bar-data.csv").then((data) => { 

	 const MAX_X2 = d3.max(data, (d) => { return parseInt(d.x); });

	 const X_SCALE2 = d3.scaleLinear() 
	                   .domain([0, (MAX_X2 + 10000)]) // add some padding  
	                   .range([0, VIS_WIDTH]); 
	// add the bars (rectangles) with styling
	FRAME1.selectAll("bars")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", (d) => d.amount)
			.attr("y", 200)
			.attr("height", (d) => d.amount)
			.attr("width", 15)



	// axis for the bar plot
	FRAME1.append("xy")
			.attr("transform", "translate(" + MARGINS.left + 
				"," + (VIS_HEIGHT + MARGINS.top) + ")")
			.call(d3.axisBottom(X_SCALE2).ticks(4))
			.attr("font-size", "20px")

})
