import { ViewOrNotInit } from '../views/interfaces';
import { IAppController, IGameController, IRouter, IStatisticsController, ITextBookController } from './interfaces';
import { Router } from './router';
import { TextBookController } from './textbookController';
import { BaseContainer } from '../views/base/baseContainer';
import AppModel from '../models/AppModel';
import { GameController } from './games/gameController';
import { StatisticsController } from './statisticsController';
import { StartGameOptions } from './types';
import { LoginController } from './loginController';
import { GameCustomEvents } from '../common/constants';

class AppController implements IAppController {
  private model: AppModel;

  private baseUrl: string;

  private router: IRouter;

  private baseContainer: BaseContainer;

  private controllers: Array<ITextBookController | IGameController | IStatisticsController>;

  private activeView: ViewOrNotInit;

  constructor() {
    this.baseUrl = 'http://localhost:8082';
    this.router = new Router(this.baseUrl);
    this.model = new AppModel(this.baseUrl);

    this.activeView = null;
    this.controllers = [
      new TextBookController(this.baseUrl, this.model),
      new GameController(this.baseUrl, this.model),
      new StatisticsController(this.baseUrl, this.model),
    ];

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
    window.addEventListener(GameCustomEvents.ShowGame, (event) => {
      const options = (<CustomEvent>event).detail as StartGameOptions;
      this.changeUrl(options.game, JSON.stringify(options)).catch((err) => console.debug(err));
      this.router.updateViewUrl(options.game.toString());
    });
  }

  private async changeUrl(path?: string, context?: string): Promise<void> {
    this.activeView = this.router.process(path ?? '');
    if (!this.activeView) {
      return;
    }
    this.controllers.forEach((ctrl) => ctrl.registerView(this.activeView, context));
    this.activeView.render();
    for (const ctrl of this.controllers) {
      await ctrl.updateView().catch((err) => console.debug(err));
    }
    LoginController.checkTimeToken();
  }
}

export { AppController };
