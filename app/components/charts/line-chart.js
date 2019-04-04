import Component from '@ember/component';
import LineChart from '../../utils/charts/line-chart'; // d3 line chart

export default Component.extend({

  classNames: ['line-chart-component'],

  didInsertElement() {
    this._super(...arguments);

    this.initializeChart(); // initialize chart once the component is inserted into DOM
  },

  didUpdateAttrs() { // On chart data updates
    this._super(...arguments);

    const updatePayload = this.get('updatePayload');

    const lineChartInstance = this.get('lineChartInstance');

    lineChartInstance.updateData(updatePayload)
  },

  initializeChart() {
    // Create an instance of the d3 Line Chart with configurations
    const lineChart = new LineChart(this.element, this.dataItems, {
      xKey: 'timestamp',
      yKey: 'rolling',
      yLabel: 'Net Income'
    });

    this.set('lineChartInstance', lineChart);
  }
})
