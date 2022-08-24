import { ChangePageFn } from '../controllers/types';
import Header from './header/header';
import { MenuBtn, MenuBtnType } from './interfaces';
import Footer from './footer/footer'

export abstract class View {
  protected root: HTMLElement;
  protected body: HTMLElement;
  private header: Header;
  private footer: Footer;

  constructor() {
    this.root = <HTMLElement>document.querySelector('.root');
    this.body = <HTMLElement>document.querySelector('body');
    this.header = new Header('header','header');
    this.footer = new Footer('footer','footer');
    this.body.append(this.header.render());
    this.body.append(this.footer.render());
    
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
