// JS File for Homework 5: Interactive Graph with D3
// Luke Abbatessa and Jocelyn Ju
// Last Modified: 02.22.2023

// Instantiate visualization dimensions/limitations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

// Create a frame for the scatter plot
const FRAME1 = d3.select("#scatterplot")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// Read data and create a scatter plot
d3.csv("data/scatter-data.csv").then((data) => {

  // Find max X
  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleLinear() 
                   .domain([0, (MAX_X + 1)]) // Add some padding  
                   .range([0, VIS_WIDTH]);

  // Find max Y
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const Y_SCALE = d3.scaleLinear() 
                   .domain([0, (MAX_Y + 1)]) // Add some padding  
                   .range([VIS_HEIGHT, 0]); 

  // Define event handler functions for point modifications
  function handleMouseover(event, d) {
      
     // Highlight the point on mouseover
     d3.select(this).style("fill", "lightcoral");
  }

  function handleMouseclick(event, d) {
    
   	 // Add a border to the point on click 
     // or remove it if the point already has a border
	   let selection = d3.select(this);
     selection.classed("stroke", !selection.classed("stroke"));


     // Display the coordinates of the point last clicked
     let newText = d3.select(this).attr("id");
	   d3.select("#coord-list").html(newText);
	}

  function handleMouseleave(event, d) {
      
     // Return point fill to original on mouseleave
     d3.select(this).style("fill", "lightblue"); 
  }

  // Add a point on click of subbutton
  function handlePointadd(event, d) {

   	 let xcoord = d3.select('#x-coords').property("value");
		 let ycoord = d3.select('#y-coords').property("value");

		 let newptID = "(" + xcoord + ", " + ycoord + ")";
	
		 // Create the point and set attributes
		 FRAME1.append('circle')
					 .attr("id", newptID)
					 .attr("cx", X_SCALE(xcoord) + MARGINS.left)
					 .attr("cy", Y_SCALE(ycoord) + MARGINS.top)
					 .attr("class", "point")
					 .attr("r", 10)
					 .on("mouseover", handleMouseover) // Add event listeners
					 .on("click", handleMouseclick)
					 .on("mouseleave", handleMouseleave);
  } 

  // Use X_SCALE and Y_SCALE to plot points
  FRAME1.selectAll("points")  
      .data(data) // Passed from .then  
      .enter()       
      .append("circle")
      	.attr("id", (d) => { return ("(" + d.x + ", " + d.y + ")"); })
      	.attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) 
        .attr("r", 10)
        .attr("class", "point")
	      .on("mouseover", handleMouseover) // Add event listeners
				.on("click", handleMouseclick)
				.on("mouseleave", handleMouseleave);

	d3.select("#subButton")
			.on("click", handlePointadd);

	// Add an x-axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(10)) 
          .attr("font-size", '10px');

  // Add a y-axis to the vis
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.top + 
              "," + MARGINS.left + ")") 
        .call(d3.axisLeft(Y_SCALE).ticks(10)) 
          .attr("font-size", '10px');

});


// Create a frame for the bar plot
const FRAME2 = d3.select("#barplot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");


// Read data and create a barplot
d3.csv("data/bar-data.csv").then((data) => { 

	const MAXy = d3.max(data, (d) => { return parseInt(d.amount); });

	const ySCALE_REV = d3.scaleLinear() 
	                   .domain([0, MAXy])  
	                   .range([VIS_HEIGHT, 0]);


	const xSCALE = d3.scaleBand()
										  .range([ 0, VIS_WIDTH ])
										  .domain(data.map(function(d) { return d.category; }))
										  .padding(0.3);

	const BAR_WIDTH = 40;


	// Create the x-axis
	FRAME2.append("g")
		 .attr("transform", "translate(" + MARGINS.left + 
		  "," + (VIS_HEIGHT+ MARGINS.bottom) + ")")
		 .call(d3.axisBottom(xSCALE))
		 .selectAll("text")
		   .attr("font-size", '10px');

	// Create the y-axis
	FRAME2.append("g")
	   .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
		 .call(d3.axisLeft(ySCALE_REV))
		 .selectAll("text")
		   .attr("font-size", '10px');


  // Create a tooltip for the barplot
  const TOOLTIP = d3.select("#barplot")
                     .append("div")
									   .attr("class", "tooltip")
									   .style("opacity", 0)
									   .style("background-color", "lightgrey")
									   .style("border", "solid")
									   .style("border-width", "2px")
									   .style("border-radius", "7px")
									   .style("padding", "3px")
									   .style("position", "absolute");

  // Define event handler functions for tooltips
  function handleMouseover(event, d) {
      
     // Make opaque on mouseover
     TOOLTIP.style("opacity", 1);

     // Highlight the bar (and outline for accessibility) on mouseover
     d3.select(this).style("fill", "lightseagreen")
      							.style("stroke", "black")
      							.style("stroke-width", "3px");
  }

  function handleMousemove(event, d) {
      
     // Position the tooltip and fill in information 
     TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
             .style("left", event.x + "px")
             .style("top", event.y + "px"); // Place the tooltip
  }

  function handleMouseleave(event, d) {
      
     // Make transparent on mouseleave
   	 // return column fill and stroke to original
     TOOLTIP.style("opacity", 0);
     d3.select(this).style("fill", "mediumpurple")
      							.style("stroke", "none"); 
  } 

	// Create the bars and add event listeners
	FRAME2.selectAll("bar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return xSCALE(d.category) + MARGINS.left; })
    .attr("y", function(d) { return ySCALE_REV(d.amount) + MARGINS.top; })
    .attr("width", BAR_WIDTH)
    .attr("height", function(d) { return VIS_HEIGHT - ySCALE_REV(d.amount); })
    .attr("class", "bar")
   .on("mouseover", handleMouseover) // Add event listeners
   .on("mousemove", handleMousemove)
   .on("mouseleave", handleMouseleave);    

});

