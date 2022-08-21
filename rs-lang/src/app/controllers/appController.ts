import { IView } from '../views/interfaces';
import { IAppController, IRouter } from './interfaces';
import { Router } from './router';

class AppController implements IAppController {
  private router: IRouter;

  private activeView: IView | undefined;

  constructor() {
    this.router = new Router();
    this.activeView = undefined;

    window.addEventListener('load', this.loadView.bind(this));
    window.addEventListener('hashchange', this.loadView.bind(this));
  }

  start(): void {
    console.log('START');
  }

  private loadView(): void {
    this.activeView = this.router.process();
    if (this.activeView) {
      this.activeView.bindChangePage(this.changePage.bind(this));
    }
  }

  public changePage(newPath: string): void {
    this.activeView = this.router.process(newPath);
    if (this.activeView) {
      this.activeView.bindChangePage(this.changePage.bind(this));
    }
  }
}

export { AppController };
