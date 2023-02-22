// JS File for Homework 5: Interactive Graph with D3
// Luke Abbatessa and Jocelyn Ju
// Last Modified: 02.19.2023

// create a frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#scatterplot")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// read data and create plot
d3.csv("data/scatter-data.csv").then((data) => {

  // find max X
  const MAX_X = d3.max(data, (d) => { return parseInt(d.x); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const X_SCALE = d3.scaleLinear() 
                   .domain([0, (MAX_X + 1)]) // add some padding  
                   .range([0, VIS_WIDTH]);

  // find max Y
  const MAX_Y = d3.max(data, (d) => { return parseInt(d.y); });
  
  // Define scale functions that maps our data values 
  // (domain) to pixel values (range)
  const Y_SCALE = d3.scaleLinear() 
                   .domain([0, (MAX_Y + 1)]) // add some padding  
                   .range([VIS_HEIGHT, 0]); 

  // Use X_SCALE and Y_SCALE to plot our points
  FRAME1.selectAll("points")  
      .data(data) // passed from .then  
      .enter()       
      .append("circle")
        .on("click", (d) => { borderClick("(" + d.x + ", " + d.y + ")"); })
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

// frame for the bar plot
const FRAME2 = d3.select("#barplot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame");


// open file for bar chart
d3.csv("data/bar-data.csv").then((data) => { 

	const MAXy = d3.max(data, (d) => { return parseInt(d.amount); });

	const ySCALE_REV = d3.scaleLinear() 
	                   .domain([0, MAXy])  
	                   .range([VIS_HEIGHT, 0]);


	const xSCALE = d3.scaleBand()
										  .range([ 0, VIS_WIDTH ])
										  .domain(data.map(function(d) { return d.category; }))
										  .padding(0.2);


	 const BAR_WIDTH = 30
	 const GAP = BAR_WIDTH / 4

	 // create the x-axis
	 FRAME2.append("g")
		  .attr("transform", "translate(" + MARGINS.left + 
		  	"," + (VIS_HEIGHT+ MARGINS.bottom) + ")")
		  .call(d3.axisBottom(xSCALE))
		  .selectAll("text")
		    .attr("font-size", '20px');

	// create the y-axis
	FRAME2.append("g")
	    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")") 
		  .call(d3.axisLeft(ySCALE_REV))
		  .selectAll("text")
		    .attr("font-size", '20px');

	// create the bars
	FRAME2.selectAll("bar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return xSCALE(d.category) + MARGINS.left; })
    .attr("y", function(d) { return ySCALE_REV(d.amount) + MARGINS.top; })
    .attr("width", BAR_WIDTH)
    .attr("class", "bar")

    .attr("height", function(d) { return VIS_HEIGHT - ySCALE_REV(d.amount); })

});

// function to add and remove border on click of a point
function borderClick(ptID) {

	console.log("clicked" + ptID);

	let element = document.getElementById(ptID);

	// display the latest selected point in the right hand column
	let newText = ptID
	let coords = document.getElementById("coord-list");

	coords.innerHTML = newText;

	// upon clicking a point, it will get a border
	// coordinates should show in right column
	// if it already has a border, disappear and remove coordinates
	if (element.classList.contains("stroke")) {
		element.classList.remove("stroke")
	}
	else {
		element.classList.add("stroke")
	}
}

// function to add new points and set their ids
function pointClick() {

	// get the coordinates of the new point from the user's selection
	let xcoords = document.getElementById("x-coords");
	let xcoord = Number(xcoords.options[xcoords.selectedIndex].text);
	let ycoords = document.getElementById("y-coords");
	let ycoord = Number(ycoords.options[ycoords.selectedIndex].text);

	let newptID = "(" + xcoord + ", " + ycoord + ")"

	let container = d3.select("#scatterplot").select("svg");
	
	// create the point and set attributes
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

