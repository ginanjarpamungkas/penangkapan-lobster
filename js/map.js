var svg = d3.select("#geo-map-container").append("svg").attr('x', 0).attr('y', 0).attr('viewBox', '0 0 960 500').attr('id', 'geo-map')
var g_maritim = svg.append("g").attr("class", "laut")
var g_indonesia = svg.append("g").attr("class", "indonesia")
var g_others = svg.append("g").attr("class", "others")
var tooltip = d3.select('body').append('div').attr('class', 'hidden tooltip');

var projection = d3.geoMercator().scale(1000).translate([-1550, 180]);
var zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);

function zoomed() {
  t = d3.event.transform;
  g_indonesia.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
  g_others.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
  g_maritim.attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}

svg.call(zoom)
var path = d3.geoPath().projection(projection);
var pathmaritim = d3.geoPath(d3.geoIdentity().reflectY(true).scale(17.2).translate([-1518, 182]));

d3.json("others.json",function(json) {others = g_others.selectAll("path").data(json.features).enter().append("path").attr("d", path).style("fill", '#d2d2d2').attr("stroke", "#ffffff").attr("stroke-width", 0.1)})
d3.json("indonesia.json",function(json) {indonesia = g_indonesia.selectAll("path").data(json.features).enter().append("path").attr("d", path).style("fill", '#a5a5a5').attr("stroke", "#ffffff").attr("stroke-width", 0.5)})
d3.json("maritim.json",
  function(json) {
    maritim = g_maritim
    .selectAll("path")
    .data(json.features)
    .enter().append("path")
    .attr("d", pathmaritim)
    .style("fill", '#fff')
    .style("opacity", '1')
    .attr("stroke", "#000000")
    .attr("stroke-width", 1)
    .on('mouseenter', function(d) {
      tooltip.style("display","block")
      d3.select(this)
        .transition()
        .style('fill', ''+d.properties.COLOR+'')
      })
    .on('mousemove', function(d) {
      tooltip
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 60) + "px")
        .html(`
        <div><center><span>${d.properties.NAME}</span></center></div>
        <div><span>Wilayah:</span><br><p>${d.properties.WILAYAH}</p></div>
        <div><span>Potensi:</span><br><p>${d.properties.POTENSI}</p></div>
        <div><span>Tangkapan Diperbolehkan:</span><br><p>${d.properties.TANGKAPAN}</p></div>
        <div><span>Tingkat Pemanfaatan:</span><br><p>${d.properties.PEMANFAATAN}</p></div>
        <div><span>Status:</span><br><p>${d.properties.STATUS}</p></div>
        `);
    })
    .on('mouseout', function() {
        tooltip.style("display","none")
        d3.select(this)
        .transition()
        .style('fill', '#fff')
    });
  }
)