// styles
import './css/main.css';

// charts
import LineChart from './components/line-chart/line-chart';
import RadarChart from './components/radar-chart/radar-chart';

// interfaces
import { Config } from './config';

// worklets
const bubbleBorderWorklet = new URL('./worklets/bubble-border.js', import.meta.url);
const gridBasicWorklet = new URL('./worklets/grid-basic.js', import.meta.url);
const gridRadarWorklet = new URL('./worklets/grid-radar.js', import.meta.url);
const linearPathWorklet = new URL('./worklets/linear-path.js', import.meta.url);

// currently TypeScript does not support the paintWorklet property
// @ts-ignore
CSS.paintWorklet.addModule(bubbleBorderWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(gridBasicWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(gridRadarWorklet.href);
// @ts-ignore
CSS.paintWorklet.addModule(linearPathWorklet.href);

class HoudiniChart {
  constructor(private readonly container: HTMLElement, private readonly config: Config) {
    this.init();
  }
  public init = () => {
    switch (this.config.chartType.toLowerCase()) {
      case 'line':
        const LINECHART = new LineChart(this.container, this.config);
        break;
      case 'radar':
        const RADARCHART = new RadarChart(this.container, this.config);
        break;
    }
    this.contentLoaded();
  };

  private contentLoaded = () => {
    const getElem: HTMLElement | null = document.querySelector('.loaded');
    if (getElem) getElem.classList.add('loaded--true');
  };
}

export default HoudiniChart;
