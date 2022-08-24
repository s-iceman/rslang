import { ChangePageFn } from '../controllers/types';
import { MenuBtn, MenuBtnType } from './interfaces';

export abstract class View {
  protected baseUrl: string;

  protected root: HTMLElement;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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

      handler(path).catch((err) => console.log(err));
    });
  }

  protected extractPath(btn: MenuBtnType): string {
    return btn.href.slice(btn.href.lastIndexOf('/'));
  }

  protected abstract getBtnToChangePage(): MenuBtn;
}
