// JS File for Homework 5: Interactive Graph with D3
// Luke Abbatessa and Jocelyn Ju
// Last Modified: 02.19.2023

<<<<<<< HEAD
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
=======
// function to add and remove border on click of a point
function borderClick(ptID) {

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

// funtion to add new points and set their ids
function pointClick () {

	// get the coordinates of the new point from the user's selection
	let xcoords = document.getElementById("x-coords");
	let xcoord = Number(xcoords.options[xoords.selectedIndex].text);
	let ycoords = document.getElementById("y-coords");
	let ycoord = Number(ycoords.options[ycoords.selectedIndex].text);

	let newptID = "(" + xcoord + ", " + ycoord + ")"

	let container = document.getElementById("cont");

	// create the point and set attributes
	let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("class", "point");
	circle.setAttribute("id", newptID);
	circle.setAttribute("cx", xcoord * 20);
	circle.setAttribute("cy", ycoord * -20 + 200);
	circle.setAttribute("r", 5);
	circle.setAttribute("onclick", "borderClick('" + newptID + "')");

	container.appendChild(circle);
}

document.getElementById("subButton").addEventListener("click", pointClick);
>>>>>>> d09f6c7b1d54af14aa1747ecd35405856ce3451c
