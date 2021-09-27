$(document).ready(function() {

  fetch("data.json")
  .then(response => response.json())
  .then(json => {
    drawGraph(json.data);
    setGraphSettings(json);
  });

  function setGraphSettings(data) {
    const {date, teamOne, teamTwo, backgroundColor} = data;
    document.querySelector('#teamOneTitle').innerText = teamOne.name;
    document.querySelector('#teamOne').style.backgroundColor = teamOne.primaryColor;
    document.querySelector('#teamOneClip').style.backgroundColor = teamOne.secondaryColor;

    document.querySelector('#teamTwoTitle').innerText = teamTwo.name;
    document.querySelector('#teamTwo').style.backgroundColor = teamTwo.primaryColor;
    document.querySelector('#teamTwoClip').style.backgroundColor = teamTwo.secondaryColor;
  }



function drawGraph(data) {
  

// Metric
var vis;
var d = moment('2021-09-10');




data = data.map((item)=>{
  let value = item * 100;
  d = d.add(1, 'month');
  let date = d.format('YYYY-MM-DD HH:mm:ss'); 
  return {value, date};
});

$('.js-report-sparkline').each(function(sparklineId) {
    
  
  	const th = $(this);
    const parseDate = d3.time.format("%Y-%m-%d %H:%M:%S");
    data.forEach(function(d) {
      d.date = parseDate.parse(d.date);
      d.value = +d.value;
  });

  console.log(data);

    const w = th.width();
    const h = th.height();

    const xMargin = 130;
    const yMargin = 75;

    const y = d3.scale.linear()
                    .domain([0, 100])
                    .range([h - yMargin, yMargin]);
    const x = d3.time.scale()
        					 .domain(d3.extent(data, function(d) { return d.date; }))
                    .range([xMargin, w - xMargin]);

    const gradientY = d3.scale.linear()
                            .domain([0,30, 40,100]) .range(['#D74844','#8DB636']);
    const percentageMargin = 100 / data.length;
    const percentageX = d3.scale.linear()
                              .domain([0, data.length - 1])
                              .range([percentageMargin, 100 - percentageMargin]);

    const container = d3.select(this).append("div");

    const vis = container
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h);

    const  g = vis.append("svg:g")
                .attr("stroke", "url(#sparkline-gradient-" + sparklineId + ")")
                .attr("fill", "url(#sparkline-gradient-" + sparklineId + ")");
          

    const area = d3.svg.area()
          .interpolate("cardinal")
        	.x(function(d,i) { return x(d.date); })
          .y0(h)
          .y1(function(d) { return y(d.value); });

    const line = d3.svg.line()
            .interpolate("cardinal")
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.value); });

        
           
  
       
   		 // draw line points
    const points = g.selectAll(".point")
            .data([data[0], data[data.length - 1]])
            .enter().append("svg:circle")
            .attr("class", function(d, i) { "point end"; })
            .attr("cx", function(d, i) { return x(d.date) })
            .attr("cy", function(d, i) { return y(d.value) })
            .attr("r",  function(d, i) { return 7});

    // draw line with data
    g.append("svg:path").attr("d", line(data)); 
 
   // attach gradient to line
    const defs = vis.append("svg:defs");
    defs.append("svg:linearGradient")
        .attr("id", "sparkline-gradient-" + sparklineId)
        .attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%")
        .attr("gradientUnits", "userSpaceOnUse")
        .selectAll(".gradient-stop")
        .data([0,20, 40, 80])
        .enter()
        .append("svg:stop").attr('offset', function(d, i) {
            return ((percentageX(d))) + "%";
        }).attr("style", function(d) {
            return "stop-color:" + gradientY(d) + ";stop-opacity:1";
        });
});

}

});



/*
var id = 0;
var activeDropShadow;

var dropShadow = {
  'stdDeviation': 2,
  'dx': 0,
  'dy': 0,
  'slope': 0.5,
  'type': 'linear'
};

var inputs = {
  'stdDeviation': d3.select('#stdDeviation'),
  'dx': d3.select('#dx'),
  'dy': d3.select('#dy'),
  'slope': d3.select('#slope'),
  'type': d3.select('#type')
};

// Drop shadow
addDrawDropShadow();

d3.select('#addDropShadow').on('click', updateDropShadowValues);
d3.select('#resetDropShadow').on('click', resetDropShadow);


function addDrawDropShadow() {
    activeDropShadow = 'dropshadow-' + id;
    id++;

    var filter = svg.append('defs')
        .append('filter')
            .attr('id', activeDropShadow)
            // x, y, width and height represent values in the current coordinate system that results
            // from taking the current user coordinate system in place at the time when the
            // <filter> element is referenced
            // (i.e., the user coordinate system for the element referencing the <filter> element via a filter attribute).
            .attr('filterUnits','userSpaceOnUse');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', parseInt(dropShadow.stdDeviation));

    filter.append('feOffset')
        .attr('dx', parseInt(dropShadow.dx))
        .attr('dy', parseInt(dropShadow.dy));

    var feComponentTransfer = filter.append('feComponentTransfer');
    feComponentTransfer
        .append('feFuncA')
            .attr('type', dropShadow.type)
            .attr('slope', parseFloat(dropShadow.slope));

    var feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}

function applyDropShadow() {
  svg.selectAll('line')
    .attr('filter', 'url(#' + activeDropShadow + ')' );

  svg.selectAll('circle')
    .attr('filter', 'url(#' + activeDropShadow + ')' );
}

function resetDropShadow() {
  svg.selectAll('line')
    .attr('filter', null);

  svg.selectAll('circle')
    .attr('filter', null);
}

function updateDropShadowValues() {
  var keys = Object.keys(inputs);

  keys.forEach(function(key) {
    dropShadow[key] = inputs[key].property('value');
  });

  svg.selectAll('defs').remove();

  addDrawDropShadow();
  applyDropShadow();
}
*/