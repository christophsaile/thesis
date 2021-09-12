import { niceScale } from '../../utils/nice-num';
import { getMinValue } from '../../utils/get-min-value';
import { getMaxValue } from '../../utils/get-max-value';

// styles
import './line-chart.css';

// Interfaces
import { Data, Datavalue } from '../../data';
import { flattenDataset } from '../../utils/flatten-dataset';

class LineChart {
  constructor(private readonly data: Data) {}

  private getScaleSettings = this.data.data.scale;
  private getDatasets = this.data.data.datasets;
  private getLabels = this.data.data.labels;

  private autoScale = this.getScaleSettings.auto;
  private yMin = this.autoScale
    ? getMinValue(flattenDataset(this.getDatasets, 'y'))
    : this.getScaleSettings.min!;
  private yMax = this.autoScale
    ? getMaxValue(flattenDataset(this.getDatasets, 'y'))
    : this.getScaleSettings.max!;
  private niceNumbers = niceScale(this.yMin, this.yMax);

  private getRenderLocation = (): HTMLElement => {
    return document.querySelector('#lineChart')!;
  };

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
        ${this.data.title && this.renderTitle()}
        ${this.data.options?.titleAxis?.y && this.renderTitleY()}
        ${this.renderChart()}
        ${this.data.options?.titleAxis?.x && this.renderTitelX()}
      </div>
    `;
    this.getRenderLocation().innerHTML = defaultTemplate;
  };

  private renderTitle = () => {
    return `<h2 class='lineChart__title'>${this.data.title}</h2>`;
  };

  private renderTitleY = () => {
    return `<h3 class='lineChart__title-y'>${this.data.options?.titleAxis?.y}</h3>`;
  };

  private renderTitelX = () => {
    return `<h3 class='lineChart__title-x'>${this.data.options?.titleAxis?.x}</h3>`;
  };

  private renderChart = () => {
    return `
      <section class='lineChart__chart'>
        ${this.renderChartY()}
        ${this.renderData()}
        ${this.renderChartX()}
      </section>
    `;
  };

  private renderChartY = () => {
    const { tickSpacing, niceMinimum, niceMaximum } = this.niceNumbers;
    console.log(tickSpacing, niceMinimum, niceMaximum);
    let template: string = '';

    for (let i = niceMinimum; i <= niceMaximum; i = i + tickSpacing) {
      template += `<span class='lineChart__label-y'>${i}</span>`;
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
      <section class='lineChart__data'>
        ${this.getDatasets
          .map((set) => {
            return `<section id='${set.name}' class='lineChart__dataset'>${this.renderDataset(
              set.values
            )}</section>`;
          })
          .join('')}
      </section>
    `;
  };

  private renderDataset = (values: Datavalue[]) => {
    return `
      ${values
        .map(
          (value) =>
            `<span class='lineChart__datapoint' ${this.setDatapointPosition(value)}></span>`
        )
        .join('')}
    `;
  };

  private setDatapointPosition = (value: Datavalue) => {
    // const relativeX1Percentage = minX + ((maxX-minX)*(x1Value/100));
    // const relativeY1Percentage = minY + ((maxY-minY)*(y1Value/100));

    return `style='left: ${value.x}px; bottom: ${value.y}px'`;
  };
}

export default LineChart;
