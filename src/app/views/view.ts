import { ChangePageFn } from '../controllers/types';
import { MenuBtn, MenuBtnType } from './interfaces';

export abstract class View {
  protected root: HTMLElement;

  constructor() {
    this.root = <HTMLElement>document.querySelector('.root');
  }

  static getPath(): string {
    return '';
  }
}
