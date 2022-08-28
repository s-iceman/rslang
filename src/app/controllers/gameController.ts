import State from '../models/State';
import AppModel from '../models/AppModel';
import { IGameController } from './interfaces';
import { IGameView, ViewOrNotInit } from './../views/interfaces';
import { BaseGameView } from '../views/games/common/baseGame';
import { GameType } from './constants';
import { UnitLevels } from './constants';
import { IApiWords } from '../models/interfaces';

export class GameController extends State implements IGameController {
  private baseUrl: string;

  private model: AppModel;

  private gameView: IGameView | null;

  private gameType: GameType | undefined;

  private gameWords: IApiWords[];

  private currentWordIdx: number;

  constructor(baseUrl: string, model: AppModel) {
    super();
    this.gameView = null;
    this.baseUrl = baseUrl;
    this.model = model;
    this.gameType = undefined;
    this.gameWords = [];
    this.currentWordIdx = 0;
  }

  registerView(view: ViewOrNotInit): void {
    if (view instanceof BaseGameView) {
      this.gameView = view;
      this.gameView.setController(this);
      this.gameType = view.getGameType();
    } else {
      this.gameView = null;
      this.gameType = undefined;
    }
  }

  async updateView(): Promise<void> {
    if (this.gameView) {
      this.gameView.updateView();
      await new Promise(() => {});
    }
  }

  async startGame(level?: UnitLevels): Promise<void> {
    this.gameWords = await this.model.getWords(level);
    if (!this.gameWords || this.gameWords.length === 0) {
      throw new Error('Invalid list of the words');
    }
    this.gameView?.startGame(this.gameWords[this.currentWordIdx]);
  }

  processAnswer(answerOption: string): void {
    this.currentWordIdx += 1;
    this.gameView?.showWord(this.gameWords[this.currentWordIdx]);
  }
}
