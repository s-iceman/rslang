import { ViewPath } from '../../common/constants';
import { IStatisticsView } from './../interfaces';
import { View } from '../view';
import { IStatisticsController } from '../../controllers/interfaces';

export class StatisticsView extends View implements IStatisticsView {
  private ctrl: IStatisticsController | null;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.ctrl = null;
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
    this.root.innerHTML = 'У вас пока нет сохраненных результатов';
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = 'Статистика';
    return [container];
  }
}
