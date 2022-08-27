import { ViewOrNotInit } from '../views/interfaces';
import { IAppController, IRouter, ITextBookController } from './interfaces';
import { Router } from './router';
import { TextBookController } from './textbookController';
import { BaseContainer } from '../views/base/baseContainer';

class AppController implements IAppController {
  private baseUrl: string;

  private router: IRouter;

  private baseContainer: BaseContainer;

  private textBookCtrl: ITextBookController;

  private activeView: ViewOrNotInit;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
    this.router = new Router(this.baseUrl);

    this.activeView = null;
    this.textBookCtrl = new TextBookController(this.baseUrl);

    this.baseContainer = new BaseContainer();
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
    this.activeView = this.router.process(path ?? '');
    if (this.activeView) {
      await this.textBookCtrl.setView(this.activeView);
    }
  }
}

export { AppController };
