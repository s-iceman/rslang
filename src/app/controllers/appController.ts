import { ViewOrNotInit } from '../views/interfaces';
import { IAppController, IRouter, ITextBookController } from './interfaces';
import { Router } from './router';

class AppController implements IAppController {
  private router: IRouter;

  private textBookCtrl: ITextBookController;

  private activeView: ViewOrNotInit;

  constructor(textBookCtrl: ITextBookController) {
    this.router = new Router();

    this.activeView = null;
    this.textBookCtrl = textBookCtrl;

    window.addEventListener('load', () => {
      const path = window.localStorage.getItem('page') ?? '';
      this.changeUrl(path);
    });
    window.addEventListener('hashchange', () => {
      this.changeUrl();
    });
  }

  start(): void {
    console.debug('Run controller');
  }

  private changeUrl(path?: string): void {
    this.activeView = this.router.process(path ?? '');
    if (this.activeView) {
      this.activeView.bindChangePage(this.changePage.bind(this));
      this.textBookCtrl.setView(this.activeView);
    }
  }

  public changePage(newPath: string): void {
    this.activeView = this.router.process(newPath);
    if (this.activeView) {
      this.activeView.bindChangePage(this.changePage.bind(this));
      this.textBookCtrl.setView(this.activeView);
      window.localStorage.setItem('page', newPath);
    }
  }
}

export { AppController };
