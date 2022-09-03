import State from '../../models/State';
import AppModel from '../../models/AppModel';
import { IGameController, IGameEngine, IModelHelper } from './../interfaces';
import { IGameView, ViewOrNotInit } from './../../views/interfaces';
import { BaseGameView } from '../../views/games/common/baseGame';
import { GameType } from './../constants';
import { UnitLevels } from './../constants';
import { SprintEngine, AudioCallEngine } from './gameEngines';
import { SoundController } from './../soundController';
import { StartGameOptions } from './../types';
import { ModelHelper, UserModelHelper } from './modelHelpers';
import { GameCustomEvents } from '../../common/constants';

export class GameController extends State implements IGameController {
  private model: AppModel;

  private gameView: IGameView | null;

  private gameType: GameType | undefined;

  private gameEngine: IGameEngine | null;

  private modelHelper: IModelHelper | null;

  private soundCtrl: SoundController;

  private context: StartGameOptions | undefined;

  private onEndGame: () => Promise<void>;

  constructor(baseUrl: string, model: AppModel) {
    super();
    this.gameView = null;
    this.model = model;
    this.gameType = undefined;
    this.gameEngine = null;
    this.modelHelper = null;
    this.onEndGame = this.endGame.bind(this);
    this.soundCtrl = new SoundController();
  }

  registerView(view: ViewOrNotInit, context?: string): void {
    if (view instanceof BaseGameView) {
      this.gameView = view;
      this.gameView.setController(this);
      this.gameType = view.getGameType();
      this.gameEngine = this.createEngine();
      if (context) {
        this.context = <StartGameOptions>JSON.parse(context);
      }
      if (this.isAuth()) {
        this.modelHelper = new UserModelHelper(this.model, this.context);
      } else {
        this.modelHelper = new ModelHelper(this.model, this.context);
      }
    } else {
      this.clear();
    }
  }

  canSelectUnit(): boolean {
    return this.context === undefined;
  }

  async updateView(): Promise<void> {
    if (this.gameView) {
      this.gameView.updateView();
      await new Promise(() => {}); // пока костыль
    }
  }

  async startGame(level?: UnitLevels): Promise<void> {
    window.addEventListener(GameCustomEvents.EndGame, this.onEndGame);
    const words = await this.modelHelper?.getWords(level);
    if (!words || words.length === 0 || !this.gameEngine) {
      throw new Error('Invalid list of the words');
    }

    this.gameEngine.preprocessWords(words);
    const wordData = this.gameEngine.getNextWord();
    if (!wordData) {
      throw Error('Invalid word');
    }
    this.gameView?.startGame(wordData);
  }

  private async endGame(): Promise<void> {
    if (!this.gameEngine) {
      return;
    }
    this.gameView?.endGame(this.gameEngine.getResults(), this.gameEngine.getScore());
    if (this.modelHelper instanceof UserModelHelper) {
      await this.modelHelper.processGameResults(this.gameEngine.getFullResults());
    }
    this.gameEngine.clear();
    window.removeEventListener(GameCustomEvents.EndGame, this.onEndGame);
  }

  async processAnswer(answerOption: number): Promise<void> {
    if (!this.gameEngine) {
      return;
    }
    const isCorrect = this.gameEngine.checkAnswer(answerOption);
    this.soundCtrl.stopPlay();
    await this.soundCtrl.startPlay(isCorrect);
    this.gameView?.updateScore(this.gameEngine.getScore());
    this.gameView?.updatePoints(this.gameEngine.getPoints());
    this.gameView?.toggleStileCard(isCorrect);

    const nextWordData = this.gameEngine.getNextWord();
    if (!nextWordData) {
      this.endGame().catch((err) => console.debug(err));
    } else {
      this.gameView?.showWord(nextWordData);
    }
  }

  private createEngine(): IGameEngine {
    if (this.gameType === GameType.Sprint) {
      return new SprintEngine();
    } else {
      return new AudioCallEngine();
    }
  }

  private clear(): void {
    this.context = undefined;
    this.gameView = null;
    this.gameType = undefined;
    this.gameEngine = null;
    this.modelHelper = null;
  }
}
