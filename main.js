// JS File for Homework 5: Interactive Graph with D3
// Luke Abbatessa and Jocelyn Ju
// Last Modified: 02.19.2023

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

  // Use X_SCALE and Y_SCALE to plot our points
  FRAME1.selectAll("points")  
      .data(data) // Passed from .then  
      .enter()       
      .append("circle")
      	.attr("id", (d) => { return ("(" + d.x + ", " + d.y + ")"); })
        .on("click", borderClick)
      	.attr("cx", (d) => { return (X_SCALE(d.x) + MARGINS.left); }) 
        .attr("cy", (d) => { return (Y_SCALE(d.y) + MARGINS.top); }) 
        .attr("r", 10)
        .attr("class", "point");
  
  // Add an x axis to the vis  
  FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(10)) 
          .attr("font-size", '10px');

  // Add a y axis to the vis
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


// Open file for bar chart
d3.csv("data/bar-data.csv").then((data) => { 

	const MAXy = d3.max(data, (d) => { return parseInt(d.amount); });

	const ySCALE_REV = d3.scaleLinear() 
	                   .domain([0, MAXy])  
	                   .range([VIS_HEIGHT, 0]);


	const xSCALE = d3.scaleBand()
										  .range([ 0, VIS_WIDTH ])
										  .domain(data.map(function(d) { return d.category; }))
										  .padding(0.3);

	 const BAR_WIDTH = 40


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


    // create a tooltip for the bar plot
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
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1)

      // on mouseover, highlight the bar (and outline for accessibility)
      d3.select(this).style("fill", "lightseagreen")
      							 .style("stroke", "black")
      							 .style("stroke-width", "3px")
    }

   function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Value: " + d.amount)
              .style("left", event.x + "px")
              .style("top", event.y + "px"); // place the tooltip
    }

   function handleMouseleave(event, d) {
      // on mouseleave, make transparent 
   		// return column fill and stroke to original
      TOOLTIP.style("opacity", 0)
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
   .on("mouseover", handleMouseover) //add event listeners
   .on("mousemove", handleMousemove)
   .on("mouseleave", handleMouseleave);    
});

// Implement function to add and remove border on click of a point
function borderClick(event, d) {

	// Select all points
	let points = d3.selectAll(".point");

	// Iterate through points
	for (let i = 0; i < points.length; i++) {
		if(points[i].checked) {
			
			let element = points[i].value;
		
			// Display the latest selected point in the right hand column
			let newText = d3.select(element).attr("id");
			let coords = document.getElementById("coord-list");

			coords.innerHTML = newText;

			// Upon clicking a point, it will get a border
			// coordinates should show in right column
			// if it already has a border, disappear and remove coordinates
			if (element.classList.contains("stroke")) {
				element.classList.remove("stroke");
			}
			else {
				element.classList.add("stroke");
			}
		}
	}
}

// Implement function to add new points and set their ids
function pointClick() {

	// Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleLinear() 
                   .domain([0, (9 + 1)]) // add some padding  
                   .range([0, VIS_WIDTH]);

  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const Y_SCALE = d3.scaleLinear() 
                   .domain([0, (9 + 1)]) // add some padding  
                   .range([VIS_HEIGHT, 0]);

	// Get the coordinates of the new point from the user's selection
	let xcoords = document.getElementById("x-coords");
	let xcoord = Number(xcoords.options[xcoords.selectedIndex].text);
	let ycoords = document.getElementById("y-coords");
	let ycoord = Number(ycoords.options[ycoords.selectedIndex].text);

	let newptID = "(" + xcoord + ", " + ycoord + ")";

	let container = d3.select("#scatterplot").select("svg");
	
	// Create the point and set attributes
	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("class", "point");
	circle.setAttribute("id", newptID);
	circle.setAttribute("cx", X_SCALE(xcoord) + MARGINS.left);
  circle.setAttribute("cy", Y_SCALE(ycoord) + MARGINS.top);
  circle.setAttribute("r", 10);
	circle.setAttribute("onclick", "borderClick('" + newptID + "')");
	
	container.appendChild(circle);
}

document.getElementById("subButton").addEventListener("click", pointClick);

