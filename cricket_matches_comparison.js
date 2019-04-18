/* 
FileName: cricket_matches_comparison.js
Created by: Gurjot Singh
ID: B00811724
Date: 12-March-2019
Description: Contains the bar-chart and line-chart implementation of all the T20 Matches Played so far 
*/

/*Loading data from the Dataset Reffered from https://codepen.io/jamesrmccallum/pen/LLrbxo http://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
d3.csv("data.csv").then(d => chart(d));

/*Function to update the matches */
function chart(csv) {
    /*Function to store the values in variables*/
    csv.forEach(function(d) {

        d.match = d.match;
        d.over = d.over;
        d.runs = d.runs;
        d.team = d.team;
        return d;
    })
    /*Creating Set elements */
    var months = [...new Set(csv.map(d => d.month))],
        match = [...new Set(csv.map(d => d.match))];

    /* Creating Options for all the matches*/
    var options = d3.select("#year").selectAll("option")
        .data(match)
        .enter().append("option")
        .text(d => d)

    /*Creating the SVG for the Bar Chart */
    var svg_bar = d3.select("#bar"),
        margin = {
            top: 50,
            bottom: 10,
            left: 25,
            right: 25
        },
        width = +svg_bar.attr("width") - margin.left - margin.right,
        height = +svg_bar.attr("height") - margin.top - margin.bottom;

    /*Creating the DIV element for the tooltip */
    var div_tip = d3.select("#bar").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    /*Creating the Line Chart for the SVG */
    var svg_line = d3.select("#line"),
        margin = {
            top: 50,
            bottom: 10,
            left: 25,
            right: 25
        },
        width = +svg_line.attr("width") - margin.left - margin.right,
        height = +svg_line.attr("height") - margin.top - margin.bottom;

    /*Creating the ScaleBand for the X axis */
    var x = d3.scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)
        .paddingOuter(0.2)

    /*Creating the Scaleband for the Y-Axis of the Bar Chart */
    var y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])

    /*Creating the Scaleband for the Y-Axis of the Line Chart */
    var y1 = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])

    /*Adding Descriptions for the X and Y axis */
    var xAxis = g => g
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0))

    var yAxis = g => g
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y))

    /*Appending the Axis for both the Bar Chart and the Line Chart */
    svg_bar.append("g")
        .attr("class", "x-axis")

    svg_bar.append("g")
        .attr("class", "y-axis")

    svg_line.append("g")
        .attr("class", "x-axis")

    svg_line.append("g")
        .attr("class", "y-axis")

    /*Calling the function update for changing the values of the charts */
    update(d3.select("#year").property("value"), 0)

    /*Function to update the values of the Bar and the Line chart */
    function update(match, speed) {
        /*Filtering the Data for the Team1 */
        var data = csv.filter(function(d) {
            if (d.match == match)
                if (d.team1 == d.team) {
                    {

                        return d;
                    }
                }
        })

        /*Filtering the Data for the Team2 */
        var data2 = csv.filter(function(d) {
            if (d.match == match)
                if (d.team2 == d.team) {
                    {

                        return d;
                    }
                }
        })
        /*Updating the Axis with the Maximum Runs */
        if (d3.max(data).runs > d3.max(data2).runs) {

            y.domain([0, d3.max(data, d => d.runs)]).nice()

            y1.domain([0, d3.max(data, d => d.runs)]).nice()

        } else {
            {

                y.domain([0, d3.max(data2, d => d.runs)]).nice()

                y1.domain([0, d3.max(data2, d => d.runs)]).nice()

            }
        }
        /*Adding the Transition for the Y-Axis */
        svg_bar.selectAll(".y-axis").transition().duration(speed)
            .call(yAxis);

        svg_line.selectAll(".y-axis").transition().duration(speed)
            .call(yAxis);

        x.domain(data.map(d => d.over))

        svg_bar.selectAll(".x-axis").transition().duration(speed)
            .call(xAxis)

        svg_line.selectAll(".x-axis").transition().duration(speed)
            .call(xAxis)
        /*Creating Bar1 for the Bar Chart */
        var bar = svg_bar.selectAll(".bar")
            .data(data, d => d.over)

        bar.exit().remove();

        bar.enter().append("rect")
            .attr("class", "bar")
            .attr("fill", "#FFA500")
            .attr("width", x.bandwidth() - 70)
            .on('mouseover', function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                /*Creating the Tooltip for Bar1 */
                div.html("<b>Team: " + d.team1 + "<br/>Over: " + d.over + "<br/>Runs: " + d.runs + "</b>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', function(d) {
                div.transition()
                    .duration(400)
                    .style("opacity", 0);
            })
            .merge(bar)
            .transition().duration(speed)
            .attr("x", d => x(d.over) + 12)
            .attr("y", d => y(d.runs))
            .attr("height", d => y(0) - y(d.runs))

        /*Creating the Bar2 for the Bar Chart */
        var bar1 = svg_bar.selectAll(".bar1")
            .data(data2, d => d.over)

        bar1.exit().remove();

        bar1.enter().append("rect")
            .attr("class", "bar1")
            .attr("fill", "#8B0000")
            .attr("width", x.bandwidth() - 70).on('mouseover', function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0.9);
                /*Creating the Tooltip for the Bar2 */
                div.html("<b>Team: " + d.team2 + "<br/>Over: " + d.over + "<br/>Runs: " + d.runs + "</b>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
            })
            .on('mouseout', function(d) {

                div.transition()
                    .duration(400)
                    .style("opacity", 0);

            })
            .merge(bar1)
            .transition().duration(speed)
            .attr("x", d => x(d.over) + 58)
            .attr("y", d => y(d.runs))
            .attr("height", d => y(0) - y(d.runs))


        /*Creating Line1 for the Line Chart */
        var line = d3.line()
            .x(function(d) {
                return x(d.over) + 45;
            })
            .y(function(d) {
                return y1(d.runs);
            })
            .curve(d3.curveCardinal)

        /*Creating the Line2 for the Line Chart */
        var line1 = d3.line()
            .x(function(d) {
                return x(d.over) + 45;
            })
            .y(function(d) {
                return y1(d.runs);
            })
            .curve(d3.curveCardinal)

        d3.selectAll("#line_chart").remove();

        /*Function to add transitions for Line Chart Reffered from https://bl.ocks.org/pjsier/28d1d410b64dcd74d9dab348514ed256 */
        function transition(path) {
            path.transition()
                .duration(4000)
                .attrTween("stroke-dasharray", tweenDash);
        }

        function tweenDash() {
            var l = this.getTotalLength(),
                i = d3.interpolateString("0," + l, l + "," + l);
            return function(t) {
                return i(t);
            };
        }

        /*Adding Line1 to the Line Chart */
        svg_line.append("path")
            .datum(data)
            .attr("id", "line_chart")
            .attr("class", "line")
            .call(transition).attr("d", line);

        /*Adding Line2 to the Line Chart */
        svg_line.append("path")
            .datum(data2)
            .attr("id", "line_chart")
            .attr("class", "line1")
            .call(transition).attr("d", line1);

        /*Creating Circles for the Line1 of the Line Chart */
        svg_line.selectAll("dot")
            .data(data, d => d.over)
            .enter().append("circle")
            .attr("r", 5)
            .attr("id", "line_chart")
            .attr("class", "bar")
            .attr("fill", "#FFA500")
            .attr("cx", function(d) {
                return x(d.over) + 48;
            })
            .attr("cy", function(d) {
                return y1(d.runs);
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("<b>Team: " + d.team1 + "<br/>Over: " + d.over + "<br/>Runs: " + d.runs + "</b>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        /*Creating Circles for the Line2 of the Line Chart */
        svg_line.selectAll("dot")
            .data(data2, d => d.over)
            .enter().append("circle")
            .attr("r", 5)
            .attr("id", "line_chart")
            .attr("class", "bar1")
            .attr("fill", "#8B0000")
            .attr("cx", function(d) {
                return x(d.over) + 48;
            })
            .attr("cy", function(d) {
                return y1(d.runs);
            })
            .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                /*Tooltip for the Line Chart */
                div.html("<b>Team: " + d.team2 + "<br/>Over: " + d.over + "<br/>Runs: " + d.runs + "</b>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        /*Text Description for Matches and Series */
        svg_bar.selectAll("dot").data(data).enter().append("text")
            .attr("x", 10)
            .attr("y", 13)
            .attr("id", "line_chart")
            .style("font-size", "14px")
            .text(function(d) {
                return d.match + ", " + d.series;
            });

        /*Text Description for Date */
        svg_bar.selectAll("dot").data(data).enter().append("text")
            .attr("x", 10)
            .attr("y", 32)
            .attr("id", "line_chart")
            .style("font-size", "14px")
            .text(function(d) {
                return ("Match Played on : " + d.date);
            });

        /*Text Description for Winner and Man of the Match */
        svg_line.selectAll("dot").data(data).enter().append("text")
            .attr("x", 3)
            .attr("y", 13)
            .attr("id", "line_chart")
            .style("font-size", "14px")
            .text(function(d) {
                return ("Winner : " + d.winner + ", Man of the Match : " + d.player_of_match);
            });

        /*Text Description for Match Venue */
        svg_line.selectAll("dot").data(data).enter().append("text").attr("x", 3)
            .attr("y", 32)
            .attr("id", "line_chart")
            .style("font-size", "14px")
            .text(function(d) {
                return ("Match Venue : " + d.venue);
            });

        /*Legends for Graph */
        svg_bar.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", '#FFA500')
            .attr("id", "line_chart")
            .attr("x", 590)
            .attr("y", 100);

        /*Legends for Graph */
        svg_bar.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .attr("id", "line_chart")
            .attr("width", 15)
            .attr("height", 15)
            .style("fill", '#8B0000')
            .attr("x", 590)
            .attr("y", 160);

        /*Legends for Graph */
        svg_bar.append('g')
            .attr('class', 'legend')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .text(function(d) {
                return d.team1;
            })
            .attr('fill', "black")
            .attr("id", "line_chart")
            .attr('font-family', 'Calibri')
            .attr("x", 595)
            .attr('y', 135)
            .style("font-size", "15px")
            .attr('font-family', 'Calibri')
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("text-decoration", "bold");

        /*Legends for Graph */
        svg_bar.append('g')
            .attr('class', 'legend')
            .selectAll('text')
            .data(data2)
            .enter()
            .append('text')
            .text(function(d) {
                return d.team2;
            })
            .attr('fill', "black")
            .attr("id", "line_chart")
            .attr('font-family', 'Calibri')
            .attr("x", 595)
            .attr('y', 195)
            .style("font-size", "15px")
            .attr('font-family', 'Calibri')
            .style("font-weight", "bold")
            .attr("text-anchor", "middle")
            .style("text-decoration", "bold");

    }


    /*Updating the Graphs*/
    chart.update = update;
}

/*Calling the Function on Change*/
var select = d3.select("#year")
    .style("border-radius", "5px")
    .on("change", function() {
        chart.update(this.value, 750)
    })