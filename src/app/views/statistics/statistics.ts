import { ViewPath } from '../../common/constants';
import { IView } from './../interfaces';
import { View } from '../view';

export class StatisticsView extends View implements IView {
  static getPath(): string {
    return ViewPath.STATISTICS;
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createContent());
  }

  private createContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = 'Статистика';
    return [container];
  }
}
