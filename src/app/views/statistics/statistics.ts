import { ViewPath } from '../../common/constants';
import { IStatisticsView } from './../interfaces';
import { IStatistics } from '../../models/interfaces';
import { View } from '../view';
import { IStatisticsController } from '../../controllers/interfaces';
import CreateMarkup from '../common/createMarkup';
import {
  getDayShortStat,
  getGameShortStat,
  getLastNDays,
  getNewWordsLongStat,
  getDeltaWordsLongStat,
} from '../../controllers/games/gameUtis';
import { Chart, registerables } from 'chart.js';
import { EMPTY_GAME_DATA, GameType } from '../../controllers/constants';

const N_DAYS = 7;

export class StatisticsView extends View implements IStatisticsView {
  private ctrl: IStatisticsController | null;

  private container: HTMLElement | null;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.ctrl = null;
    this.container = null;
    Chart.register(...registerables);
  }

  static getPath(): string {
    return ViewPath.STATISTICS;
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
  }

  setController(ctrl: IStatisticsController): void {
    this.ctrl = ctrl;
  }

  setError(): void {
    if (this.container) {
      this.container.innerHTML = '';
      const error: HTMLDivElement = document.createElement('div');
      error.textContent = 'У вас пока нет сохраненных результатов';
      this.container.append(error);
    }
  }

  fillStatistics(stat: IStatistics): void {
    if (this.container) {
      this.container.innerHTML = '';

      this.createWordsShortStat(stat);
      this.createSprintShortStat(stat);
      this.createVoiceCallShortStat(stat);
      this.createNewWordsLongStat(stat);
      this.createDeltaWordsLongStat(stat);
    }
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'stat__container';
    this.container = container;
    return [container];
  }

  private createWordsShortStat(stat: IStatistics): void {
    const data = getDayShortStat(stat);
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__block';

    new CreateMarkup(block, 'div', 'stat__title', 'Статистика за сегодня');

    this.createDaysShortStat(block, [data.nNew, data.nStudy], ['Новых слов', 'Изученных слов']);
    this.createAnswersShortStat(block, data.correctAnswers);
    this.container?.append(block);
  }

  private createSprintShortStat(stat: IStatistics): void {
    const data = getGameShortStat(stat, GameType.Sprint);
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__block';

    new CreateMarkup(block, 'div', 'stat__title', `Спринт`);
    this.createDaysShortStat(block, [data.nNew, data.streak], ['Новых слов', 'Максимальная длина серии']);
    this.createAnswersShortStat(block, data.correctAnswers);
    this.container?.append(block);
  }

  private createVoiceCallShortStat(stat: IStatistics): void {
    const data = getGameShortStat(stat, GameType.VoiceCall);
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__block';

    new CreateMarkup(block, 'div', 'stat__title', 'Аудиовызов');
    this.createDaysShortStat(block, [data.nNew, data.streak], ['Новых слов', 'Максимальная длина серии']);
    this.createAnswersShortStat(block, data.correctAnswers);
    this.container?.append(block);
  }

  private createNewWordsLongStat(stat: IStatistics): void {
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__block';
    new CreateMarkup(block, 'div', 'stat__title', `Статистика за ${N_DAYS} дней`);
    this.createLongStatChart(block, getNewWordsLongStat(stat, N_DAYS));
    this.container?.append(block);
  }

  private createDeltaWordsLongStat(stat: IStatistics): void {
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__block';
    new CreateMarkup(block, 'div', 'stat__title', `Рост числа изученных слов за ${N_DAYS} дней`);
    this.createLongStatChart(block, getDeltaWordsLongStat(stat, N_DAYS));
    this.container?.append(block);
  }

  private createLongStatChart(parent: HTMLElement, data: number[]): void {
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__chart';
    const canvas = new CreateMarkup(block, 'canvas');

    new Chart(<HTMLCanvasElement>canvas.node, {
      type: 'line',
      data: {
        labels: getLastNDays(N_DAYS),
        datasets: [
          {
            data: data,
            borderColor: 'rgb(75, 192, 192)',
            label: 'Новые слова',
            fill: false,
          },
        ],
      },
    });
    parent.append(block);
  }

  private createDaysShortStat(parent: HTMLElement, stat: number[], labels: string[]): void {
    const block: HTMLElement = document.createElement('div');
    block.className = 'stat__chart';
    const canvas = new CreateMarkup(block, 'canvas');

    new Chart(<HTMLCanvasElement>canvas.node, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            data: stat,
            barPercentage: 0.4,
            borderColor: 'rgb(255, 0, 0)',
            label: 'Прогресс по словам',
            backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
          },
        ],
      },
    });
    parent.append(block);
  }

  private createAnswersShortStat(parent: HTMLElement, stat: number): void {
    const block: HTMLElement = document.createElement('div');
    if (stat === EMPTY_GAME_DATA) {
      block.textContent = 'Вы сегодня не играли в эту игру';
      parent.append(block);
      return;
    }
    block.classList.add('stat__chart');
    block.classList.add('stat__chart_doughnut');
    const canvas = new CreateMarkup(block, 'canvas');

    new Chart(<HTMLCanvasElement>canvas.node, {
      type: 'doughnut',
      data: {
        labels: ['Правильных ответов (%)', 'Ошибок (%)'],
        datasets: [
          {
            data: [stat, 100 - stat],
            backgroundColor: ['rgb(199, 0, 38)', 'rgb(230, 230, 230)'],
            label: 'Ответы за сегодня',
          },
        ],
      },
    });
    parent.append(block);
  }
}
