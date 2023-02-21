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

const FRAME2 = d3.select("#barplot") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 



// open file for bar chart
d3.csv("data/bar-data.csv").then((data) => { 
	let xlab = ["A", "B", "C", "D", "E", "F", "G"]

	const MAX_Y = d3.max(data, (d) => { return parseInt(d.amount); });
	const Y_SCALE = d3.scaleLinear() 
	                   .domain([0, (MAX_Y)])  
	                   .range([0, VIS_HEIGHT]); 

	const Y_SCALE_REV = d3.scaleLinear() 
	                   .domain([0, (MAX_Y)])  
	                   .range([VIS_HEIGHT, 0]);


	// const X_SCALE = d3.scaleBand() 
	//                    .domain(xlab)  
	//                    .range([0, VIS_WIDTH]); 

	 const X_SCALE = d3.scalePoint() 
	                   .domain(xlab)  
	                   .range([0, VIS_WIDTH]); 

	console.log(X_SCALE('A'))
 	console.log(X_SCALE('B'))
 	console.log(X_SCALE('C'))
 	console.log(X_SCALE('D'))
 	console.log(X_SCALE('E'))
 	console.log(X_SCALE('F'))
 	console.log(X_SCALE('G'))

	 const BAR_WIDTH = 30
	 const GAP = BAR_WIDTH / 4


	// add the bars (rectangles) with styling
	FRAME2.selectAll("bars")
		.data(data)
		.enter()
		.append("rect")
			.attr("x", (d) => (X_SCALE(d.categories)))
			.attr("y", (d) =>  (VIS_HEIGHT - Y_SCALE(d.amount) + MARGINS.top))
			.attr("height", (d) => Y_SCALE(d.amount))
			.attr("width", BAR_WIDTH)
			.attr("class", "bar");

    // x axis for the bar plot
	FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + (VIS_HEIGHT+ MARGINS.bottom) + ")") 
        .call(d3.axisBottom(X_SCALE).ticks(7)) 
        .selectAll("text")
          .attr("font-size", '20px')
          .attr("transform", "translate(-10,0) rotate(-45)"); 

     // Y axis for the bar plot
	FRAME2.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
              "," + MARGINS.top + ")") 
        .call(d3.axisLeft(Y_SCALE_REV).ticks(4)) 
          .attr("font-size", '20px'); 
});

	// axis for the bar plot
	//FRAME2.append("xy")
	//		.attr("transform", "translate(" + MARGINS.left + 
	//			"," + (VIS_HEIGHT + MARGINS.top) + ")")
	//		.call(d3.axisBottom(X_SCALE2).ticks(4))
	//		.attr("font-size", "20px")

//})

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

