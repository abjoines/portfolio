var width = 1400,
    height = 1200;

// Read in CSV doc
d3.csv("top100.csv", function(error, links) {
  links.forEach(function(d) {
   d["Stock"] = +d['Stock'];
   d["AbsDifference"] = +d['AbsDifference'];
   d["Difference"] = +d['Difference'];
  //  d["yLat"] = +d['yLat'];
  //  d["xLong"] = +d['xLong'];

  //  d.yLat = d.yLat+75;
  //  d.xLong = d.xLong+125;
 });
  console.log(links[0]);

// Set up
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


  var lengthen = function(d) {
    if( d.Stock > 1000000) { 
      return 125
    } else {
      return 175
    }
  };

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(lengthen))
    .force("charge", d3.forceManyBody().strength(-60))
    .force("collide", d3.forceCollide().radius(30).strength(0.9))
    .force("center", d3.forceCenter(((width / 4) * 2), height / 2)); 

// Create nodes for each source and target.
var nodesByName = {};

  links.forEach(function(link) {
    link.source = nodeByName(link.source);
    link.target = nodeByName(link.target);
  });

  var nodes = d3.values(nodesByName);

function nodeByName(name) {
  return nodesByName[name] || (nodesByName[name] = {name: name});
}

// Create arrows
  svg.append("svg:defs").selectAll("marker")
  .data(["end"])      
  .enter().append("svg:marker")
  .attr("id", String)
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 0)
  .attr("refY", 0)
  .attr("markerWidth", 5)
  .attr("markerHeight", 5)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M0,-5L10,0L0,5");

// Create the link lines
  var link = svg.selectAll(".links")
  .data(links)
  .enter().append("svg:path")
  .attr("class", "link")
  .attr("fill", "none")
  // .attr("stroke", "black")
  .attr("marker-mid", "url(#end)");

// Create the node circles
  var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(nodes)
  .enter().append("circle")
  .attr("r", function(d) {return (d.Stock/100000); })
  .attr("stroke", "skyblue")
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

    //add label 
  node.append("title")
  .text(function(d) { return d.name });

  console.log(nodes[0]);

  var text = svg.selectAll(null)
    .data(nodes)
    .enter().append("text")
    .text(function (d) { return d.name; })
  .attr("fill", "black")
  .style("text-anchor", "start")
  .style("font-size", 12);

  simulation
    .nodes(nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(links)

function ticked() {
  link
  .attr("d", function(d) {
  // curved links
    var dx = d.target.x - d.source.x,
    dy = d.target.y - d.source.y,
    dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + 
    d.source.y + "A" + 
    dr + "," + dr + " 0 0,1 " + 
    d.target.x + "," + 
    d.target.y;})
  // stroke based on difference
  .attr("stroke-width", function(d) { return (1+((d.AbsDifference)/35000))});

  node
  .attr("transform", function(d) { 
    return "translate(" + d.x + "," + d.y + ")"; })
  .attr("r", 7)

  text
  .attr("x", function (d) { return d.x; })
  .attr("y", function (d) {return d.y - 10; })
  .style("font-size", 12);
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
});