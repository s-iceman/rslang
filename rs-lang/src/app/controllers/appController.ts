import { IAppController } from './interfaces';
import { IView } from '../views/interfaces';
import { MainPage } from '../views/mainPage';

class AppController implements IAppController {
  private mainView: IView;

  constructor() {
    this.mainView = new MainPage();
  }

  start(): void {
    this.mainView.render();
  }
}

export { AppController };
