import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';

// styles
import './line-chart.css';

// Interfaces
import { Config, Datavalue } from '../../data';
import { flattenDataset } from '../../utils/flatten-dataset';

class LineChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {}

  private getScaleSettings = this.config.data.scale;
  private getDatasets = this.config.data.datasets;
  private getLabels = this.config.data.labels;
  private getOptions = this.config.options;

  private autoScale = this.getScaleSettings.auto;
  private min = {
    x: 0,
    y: this.autoScale
      ? getMinValue(flattenDataset(this.getDatasets, 'y'))
      : this.getScaleSettings.min!,
  };
  private max = {
    x: this.getLabels.length,
    y: this.autoScale
      ? getMaxValue(flattenDataset(this.getDatasets, 'y'))
      : this.getScaleSettings.max!,
  };
  private niceNumbers = niceScale(this.min.y, this.max.y);
  private range = {
    x: this.max.x - this.min.x,
    y: this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum,
  };
  private segments = {
    x: this.max.x,
    y: (this.niceNumbers.niceMaximum - this.niceNumbers.niceMinimum) / this.niceNumbers.tickSpacing,
  };
  private centerX = 100 / this.segments.x / 2;

  private gridColor = this.getOptions?.gridColor ? this.getOptions.gridColor : '#ccc';

  public init = () => {
    this.render();
  };

  private render = () => {
    // move renderDefaultTemplate function up in render function ???
    this.renderDefaultTemplate();
  };

  private renderDefaultTemplate = () => {
    const defaultTemplate = `
      <div class='lineChart__wrapper'>
        ${this.config.title && this.renderTitle()}
        ${this.config.options?.titleAxis?.y && this.renderTitleY()}
        ${this.config.options?.titleAxis?.x && this.renderTitelX()}
        ${this.renderChart()}
      </div>
    `;
    this.container.innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title loaded'>${this.config.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__title-y'>${this.config.options?.titleAxis?.y}</h3>`;
  };

  private renderTitelX = () => {
    return `<h3 class='lineChart__title-x'>${this.config.options?.titleAxis?.x}</h3>`;
  };

  private renderChart = () => {
    return `
      <section class='lineChart__chart'>
      ${this.renderChartY()}
      ${this.renderChartX()}
      ${this.renderData()}
      </section>
    `;
  };

  private renderChartY = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    let template: string = '';
    let j = 0;

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      const percantage = (j / this.segments.y) * 100;
      template += `<span class='lineChart__label-y' style='bottom: calc(${percantage}% - 8px)'>${i}</span>`; // -8px because fontSize = 16px / 2
      j = j + 1;
    }

    return `
      <section class='lineChart__chart-y'>${template}</section>
    `;
  };

  private renderChartX = () => {
    return `
      <section class='lineChart__chart-x'>
        ${this.getLabels.map((text) => `<span class='lineChart__label-x'>${text}</span>`).join('')}
      </section>
    `;
  };

  private renderData = () => {
    return `
      <section class='lineChart__data' style='${this.setGridStyle()}'>
        ${this.getDatasets
          .map((set) => {
            return `<section id='${set.name}' class='lineChart__dataset' style='${this.setPathStyle(
              set.values,
              set.color
            )}'>${this.renderDataset(set.values, set.color)}</section>`;
          })
          .join('')}
      </section>
    `;
  };

  private setGridStyle = () => {
    return `background: paint(grid); --grid-segementsX:${this.segments.x}; --grid-segementsY:${this.segments.y}; --grid-color: ${this.gridColor}`;
  };

  private setPathStyle = (values: Datavalue[], color?: string) => {
    return `background: paint(linearPath); --path-points:${JSON.stringify(
      values
    )}; --path-range:${JSON.stringify(this.range)}; --path-color:${color};`;
  };

  private renderDataset = (values: Datavalue[], color?: string) => {
    return `
      ${values
        .map(
          (value) =>
            `<span class='lineChart__datapoint' style='${this.setDatapointStyle(
              value,
              color
            )}'></span>`
        )
        .join('')}
    `;
  };

  private setDatapointStyle = (value: Datavalue, color?: string) => {
    const percentageX = (value.x / this.range.x) * 100 + this.centerX;
    const percentageY = (value.y / this.range.y) * 100;

    const xTwoDigits = Math.round(percentageX * 100) / 100;
    const yTwoDigits = Math.round(percentageY * 100) / 100;

    return `background-color: ${color}; left: calc(${xTwoDigits}% - 5px); bottom: calc(${yTwoDigits}% - 5px)`; // -5px because dotSize = 10 / 2
  };
}

export default LineChart;