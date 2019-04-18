/* 
FileName: players_runs_comparisons.js
Created by: Gurjot Singh
ID: B00811724
Date: 15-March-2019
Description: Contains the pie-chart implementation of Shots Played by Players 
*/

/*Creating the width height for the SVG Referred from: https://bl.ocks.org/adamjanes/5e53cfa2ef3d3f05828020315a3ba18c*/
var width = 500;
var height = 540;
var radius = 150

/*Creating the SVG for the Project */
var svg_pie = d3.select("#chart-area")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", 'translate(160, 200)')
    .attr("class", "svg_details1");

/*Creating the div for the pie chart*/
var div_pie = d3.select("#chart-area").append("div")
    .attr("class", "tooltip_pie")
    .style("opacity", 0);

/* Setting the color range for different types of shots*/
var color = d3.scaleOrdinal(["#7FFF00", "#32CD32", "#228B22", "#006400", "#9ACD32", "#2E8B57"]);

/*Creating the pie chart */
var pie = d3.pie()
    .value(d => d.count)
    .sort(null);

/*Creating the pie chart arcs */
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

/*Increased arc for the animation effects */
var increased_arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius + 13);

/*Function to store the details of the players */
function type(d) {
    /*Storing the details of the players */
    d.player1 = Number(d.player1);
    d.player2 = Number(d.player2);
    d.player3 = Number(d.player3);
    d.player4 = Number(d.player4);
    d.player5 = Number(d.player5);
    d.player6 = Number(d.player6);
    return d;
}

/*Function to update the values on the pie chart */
function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(4);
    return (t) => arc(i(t));
}

/*Function to fetch the details from the JSON file dataset */
d3.json("data.json", type).then(data => {
    /*Function that will handle the on change part of the svg*/
    d3.selectAll("input")
        .on("change", update);

    /*Function to update the values of the pie chart */
    function update(val = this.value) {

        const path = svg_pie.selectAll("path")
            .data(pie(data[val]));

        /* Updating the existing arcs */
        path.transition().duration(200).attrTween("d", arcTween);

        /* Entering values for the new arcs */
        path.enter().append("path")
            .attr("fill", (d, i) => color(i))
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "6px")
            .each(function(d) {
                this._current = d;
            })
            .on('mouseover', function(d, i) {
                /*To provide complete details of each arc */
                d3.select(this).transition()
                    .duration(800)
                    .attr("d", increased_arc)

                div_pie.transition()
                    .duration(200)
                    .style("opacity", 0.9);

                div_pie.html("<b> Shot Type: </b> " + data[val][i].region + "</br><b>Runs Scored: </b>" + d.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function(d) {
                d3.select(this).transition()
                    .duration(800)
                    .attr("d", arc)

                div_pie.transition()
                    .duration(400)
                    .style("opacity", 0);
            });

        /* Adding labels for the pie chart*/
        var textG = svg_pie.selectAll(".labels")
            .data(pie(data[val]))
            .enter().append("g")
            .attr("class", "labels");

        /*Adding legends for the pie chart */
        path.append("text")
            .attr("transform", function(d) {
                d.innerRadius = 15;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                return data[val][i].count;
            })


        /*Adding Legend colors to enhance the descriptions */
        svg_pie.selectAll("bar")
            .data(pie(data[val]))
            .enter().append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", function(d, i) {
                return color(i);
            })
            .attr("x", 180)
            .attr("y", function(d, i) {
                return i * 30 - 44;
            });



        /* Adding legends - text part */
        svg_pie.append('g')
            .attr('class', 'legend')
            .selectAll('text')
            .data(pie(data[val]))
            .enter()
            .append('text')
            .text(function(d, i) {
                return data[val][i].region;
            })
            .attr('fill', "black")
            .attr('font-family', 'Calibri')
            .attr("x", 200)
            .attr('y', function(d, i) {
                return i * 30 - 30;
            })
            .style("font-size", "15px")
            .attr('font-family', 'Calibri')
            .attr("text-anchor", "right")
            .style("font-weight", "bold")
            .style("text-decoration", "bold");

        /*Adding note at the below */
        svg_pie.append('g')
            .attr('class', 'legend')
            .selectAll('text')
            .data(pie(data[val]))
            .enter()
            .append('text')
            .text(function(d) {
                return '*This visualization is an implementation of the Research Paper';
            })
            .attr('fill', "black")
            .attr('font-family', 'Calibri')
            .attr("x", 155)
            .attr('y', 250)
            .style("font-size", "12px")
            .attr('font-family', 'Calibri')
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("text-decoration", "bold");
    }
    update("player1");
});