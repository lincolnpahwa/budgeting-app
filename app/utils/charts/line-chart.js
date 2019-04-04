/* global d3 */

const DEFAULTS = {
  margin: { top: 20, right: 20, bottom: 30, left: 50 },
  duration: 500
};
// d3 line chart 
class D3LineChart {
  constructor(container, initialData = [], config = { xKey: 'x', yKey: 'y' }) {
    if (!container) {
      throw new Error('Container not found');
    }

    this.container = container;
    this.data = [].concat(initialData);
    this.config = config;
    this.setupChart();
  }

  setupChart() {
    const { margin, duration } = DEFAULTS;
    const config = this.config;
    const width = +this.container.offsetWidth - margin.left - margin.right;
    const height = +this.container.offsetHeight - margin.top - margin.bottom;
    // append svg to the parent
    const svg = d3.select(this.container).append('svg');
    // create container for chart
    const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    // create x scale
    const xScale = d3.scaleTime()
      .rangeRound([0, width]);
    // create y scale
    const yScale = d3.scaleLinear()
      .rangeRound([height, 0]);
    // create line function
    const line = d3.line()
      .x(function(d) { return xScale(d[config.xKey]); })
      .y(function(d) { return yScale(d[config.yKey]); });

    // set domains  
    xScale.domain(d3.extent(this.data, function(d) { return d[config.xKey]; }));
    yScale.domain(d3.extent(this.data, function(d) { return d[config.yKey]; }));

    // create x axis function
    const xAxis = d3.axisBottom(xScale);
    // add x axis to container
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .select('.domain');
    // create y axis function
    const yAxis = d3.axisLeft(yScale);
    // add y axis to container
    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text(config.yLabel);

    // create path for the data
    const path = g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    this.addDataToChart = function() {
      // recalculate x & y domains
      xScale.domain(d3.extent(this.data, function(d) { return d[config.xKey]; }));
      yScale.domain(d3.extent(this.data, function(d) { return d[config.yKey]; }));

      // Move x, y axis and data `path`
      svg.select('.x')
        .transition(duration)
        .call(xAxis);

      svg.select('.y')
        .transition(duration)
        .call(yAxis);

      path
        .datum(this.data)
        .transition(duration)
        .attr('d', line);

    }

  }

  updateData(payload) {
    this.data = [];
    this.data = [...payload];

    this.addDataToChart();
  }


}

export default D3LineChart;
