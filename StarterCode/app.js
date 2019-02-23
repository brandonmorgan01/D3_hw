var svgWidth = 960
var svgHeight = 500

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("health_data.csv")
    .then(function(data) {
        console.log(data[0]);

    data.forEach(function(data) {
      data.obesity = +data.obesity;
      data.income = +data.income;
      data.abbr = data.abbr;
    });

    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.obesity - 1), d3.max(data, d => d.obesity + 2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d.income -1), d3.max(data, d => d.income + 2)])
      .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("class", "stateCircle")
    .attr("r", "10");
    ;

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Obesity Level: ${d.obesity}<br>Income: ${d.income}`);
      });


    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .attr("font-weight", "bold")
      .text("Obese (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("font-weight", "bold")
      .text("In Poverty (%)");

    chartGroup.selectAll("null")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d.obesity))
      .attr("y", d => yLinearScale(d.income))
      .attr("class", "stateText")
      .attr("font-size", "10px")
      .attr('font-weight', 'bold')
      .attr("fill", "white")
      .text(d => d.abbr);
      
    });