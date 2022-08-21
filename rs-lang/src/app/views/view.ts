import { ChangePageFn } from '../controllers/types';
import { MenuBtn, MenuBtnType } from './types';

export abstract class View {
  protected root: HTMLElement;

  constructor() {
    this.root = <HTMLElement>document.querySelector('.root');
  }

  static getPath(): string {
    return '';
  }

  bindChangePage(handler: ChangePageFn): void {
    const btn = this.getBtnToChangePage();
    if (!btn) {
      return;
    }
    btn.addEventListener('click', (event) => {
      if (!event.target) {
        return;
      }

      if (!event) {
        return '';
      }
      event.preventDefault();
      const target = <MenuBtnType>event.target;
      const path = this.extractPath(target);

      handler(path);
    });
  }

  protected extractPath(btn: MenuBtnType): string {
    return btn.href.slice(btn.href.lastIndexOf('/'));
  }

  protected abstract getBtnToChangePage(): MenuBtn;
}
