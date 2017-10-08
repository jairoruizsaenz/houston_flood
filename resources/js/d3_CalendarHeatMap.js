var width = 1140,
    height = 140,
    cellSize = 17;

var formatPercent = d3.format(".1%");

d3.csv("resources/data/data2.csv", function(error, data) {
  if (error) throw error;

var Max_Close = d3.max(data, function(d) { return d.Close; });
var Min_Close = d3.min(data, function(d) { return d.Close; });
    
var color = d3.scaleQuantize()
//.domain([-0.05, 0.05])  
.domain([0, Max_Close])  
.range(["#000", "#0d1b23", "#1b3748", "#2a536d", "#386f91", "#468bb6", "#69a2c6", "#8eb9d4", "#b3d0e2", "#d8e7f0", "#fdfefe"]);    
    
var Max_Year = new Date(d3.max(data, function(d) { return d.Date; })).getFullYear();
var Min_Year = new Date(d3.min(data, function(d) { return d.Date; })).getFullYear();

var svg = d3.select("#d3_02_grafico")
  .selectAll("svg")
  .data(d3.range(Max_Year, Min_Year -1, -1))
//.data(d3.range(2018, 1990, -1))

  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .text(function(d) { return d; });

var rect = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
  .selectAll("rect")
  .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d), d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(d3.timeFormat("%Y-%m-%d"));

svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
  .selectAll("path")
  .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("d", pathMonth);

  var data = d3.nest()
      .key(function(d) { return d.Date; })
      .rollup(function(d) { return (d[0].Close); })
      //.rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })  
    .object(data);

  rect.filter(function(d) { return d in data; })
      .attr("fill", function(d) { return color(data[d]); })
    .append("title")
      .text(function(d) { return d + ": " + (data[d]); });
      //.text(function(d) { return d + ": " + formatPercent(data[d]); });
});

function pathMonth(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}