import { ViewOrNotInit } from '../views/interfaces';
import { IAppController, IRouter, ITextBookController } from './interfaces';
import { Router } from './router';
import { TextBookController } from './textbookController';

class AppController implements IAppController {
  private baseUrl: string;

  private router: IRouter;

  private textBookCtrl: ITextBookController;

  private activeView: ViewOrNotInit;

  constructor() {
    this.baseUrl = 'http://localhost:8080';
    this.router = new Router(this.baseUrl);

    this.activeView = null;
    this.textBookCtrl = new TextBookController(this.baseUrl);
  }

  start(): void {
    this.addListeners();
  }

  private addListeners(): void {
    window.addEventListener('load', () => {
      const path = window.localStorage.getItem('page') ?? '';
      this.changeUrl(path).catch((err) => console.debug(err));
    });
    window.addEventListener('hashchange', () => {
      this.changeUrl().catch((err) => console.debug(err));
    });
  }

  private async changeUrl(path?: string): Promise<void> {
    console.log('!!!', path);
    this.activeView = this.router.process(path ?? '');

    if (this.activeView) {
      this.activeView.bindChangePage(this.changePage.bind(this));
      await this.textBookCtrl.setView(this.activeView);
    }
  }

  private async changePage(newPath: string): Promise<void> {
    this.activeView = this.router.process(newPath);
    if (!this.activeView) {
      return;
    }
    this.activeView.bindChangePage(this.changePage.bind(this));
    await this.textBookCtrl.setView(this.activeView);
    window.localStorage.setItem('page', newPath);
  }
}

export { AppController };
