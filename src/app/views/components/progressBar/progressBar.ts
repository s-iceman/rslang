import CreateMarkup from '../../common/createMarkup';
import './_progressBar.scss';
import { WARNING_TIME, ALERT_TIME, FULL_DASHARRAY, TIME_LIMIT, TIME_INTERVAL } from './constants';
import { ColorPath } from './interfaces';
import { GameCustomEvents } from '../../../common/constants';

export class ProgressBar extends CreateMarkup {
  timerInterval: null | number;

  timeLeft: number;

  timePassed: number;

  progressBarTimer: null | HTMLElement;

  svgPath: null | SVGPathElement;

  constructor(private parentNode: HTMLElement, private timeLimit = TIME_LIMIT) {
    super(parentNode, 'div', 'progress-bar');
    this.timeLimit = timeLimit;
    this.timerInterval = null;
    this.timeLeft = this.timeLimit;
    this.timePassed = 0;
    this.progressBarTimer = null;
    this.svgPath = null;
  }

  addBasicTemplate() {
    const createSvg = () => {
      const SVG_NS = 'http://www.w3.org/2000/svg';
      const BOX_WIDTH = '100';
      const BOX_HEIGHT = '100';

      const svg = document.createElementNS(SVG_NS, 'svg');
      const g = document.createElementNS(SVG_NS, 'g');
      const circle = document.createElementNS(SVG_NS, 'circle');
      const path = document.createElementNS(SVG_NS, 'path');

      svg.classList.add('progress-bar__svg');
      svg.setAttributeNS(null, 'viewbox', `0 0 ${BOX_WIDTH} ${BOX_HEIGHT}`);

      g.classList.add('progress-bar__stroke');

      circle.classList.add('progress-bar__circle');
      circle.setAttributeNS(null, 'cx', '50');
      circle.setAttributeNS(null, 'cy', '50');
      circle.setAttributeNS(null, 'r', '45');

      path.setAttributeNS(null, 'd', 'M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0');
      path.classList.add('progress-bar__path');
      path.classList.add(`${ColorPath.info}`);

      g.append(circle);
      g.append(path);
      svg.append(g);

      return svg.outerHTML;
    };

    this.node.innerHTML = createSvg();

    const progressBarTimer = new CreateMarkup(this.node, 'span', 'progress-bar__timer', this.setTime(this.timeLeft));
    this.progressBarTimer = progressBarTimer.node;
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.addBasicTemplate();
    this.svgPath = this.node.querySelector('.progress-bar__path');

    this.timerInterval = window.setInterval(() => {
      this.timePassed += 1;
      this.timeLeft = this.timeLimit - this.timePassed;
      if (this.progressBarTimer) this.progressBarTimer.innerHTML = this.setTime(this.timeLeft);
      this.setStrokeDasharray();
      this.setPathColor();
      if (this.timeLeft === 0) {
        this.stopTimer();
        window.dispatchEvent(new CustomEvent(GameCustomEvents.EndGame));
      }
    }, TIME_INTERVAL);
  }

  setTime(time: number) {
    return time >= 10 || time === 0 ? `${time}` : `0${time}`;
  }

  setPathColor() {
    if (this.timeLeft <= ALERT_TIME) {
      this.svgPath?.classList.remove(ColorPath.warning);
      this.svgPath?.classList.add(ColorPath.alert);
    } else if (this.timeLeft <= WARNING_TIME) {
      this.svgPath?.classList.remove(ColorPath.info);
      this.svgPath?.classList.add(ColorPath.warning);
    }
  }

  timeProgress() {
    const rawTimeFraction = this.timeLeft / this.timeLimit;
    return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
  }

  setStrokeDasharray() {
    const strokeDasharray = `${(this.timeProgress() * FULL_DASHARRAY).toFixed(0)} ${FULL_DASHARRAY}`;
    this.svgPath?.setAttribute('stroke-dasharray', strokeDasharray);
  }
}
