import { ViewOrNotInit } from '../views/interfaces';
import { BaseContainer } from '../views/base/baseContainer';
import { IAppController, IRouter, ITextBookController } from './interfaces';
import { Router } from './router';

class AppController implements IAppController {
  private router: IRouter;

  private baseContainer: BaseContainer;

  private textBookCtrl: ITextBookController;

  private activeView: ViewOrNotInit;

  constructor(textBookCtrl: ITextBookController) {
    this.router = new Router();

    this.activeView = null;
    this.baseContainer = new BaseContainer();

    this.textBookCtrl = textBookCtrl;

    window.addEventListener('load', () => {
      const path = window.localStorage.getItem('page') ?? '';
      console.log('LOAD', path);
      this.changeUrl(path);
    });
    window.addEventListener('hashchange', () => {
      console.log('CHANGE HASH');
      this.changeUrl();
    });
  }

  start(): void {
    console.debug('Run controller');
  }

  private changeUrl(path?: string): void {
    this.activeView = this.router.process(path ?? '');
    if (this.activeView) {
      this.textBookCtrl.setView(this.activeView);
    }
  }
}

export { AppController };
