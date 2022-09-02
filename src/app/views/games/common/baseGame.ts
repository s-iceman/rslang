import { View } from '../../view';
import { IGameController } from '../../../controllers/interfaces';
import { IStartPage } from './../intefaces';
import { IGameView } from '../../interfaces';
import { GameType } from '../../../controllers/constants';
import { IApiWords } from '../../../models/interfaces';
import { DropDownTimer } from './timer';
import { GameCardData } from '../../../controllers/types';
import { createResults } from './results';

export abstract class BaseGameView extends View implements IGameView {
  protected ctrl: IGameController | null;

  protected startPage: IStartPage | null;

  protected timerBlock: HTMLElement | null;

  protected scoreBlock: HTMLElement | null;

  protected pointsBlock: HTMLElement | null;

  protected gameControls: HTMLElement | null;

  protected timer: DropDownTimer;

  protected onProcessKey: (event: KeyboardEvent) => void;

  protected onProcessClick: (event: MouseEvent) => void;

  protected onCloseResults: (event: MouseEvent) => void;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.ctrl = null;
    this.startPage = null;
    this.scoreBlock = null;
    this.pointsBlock = null;
    this.timerBlock = null;
    this.gameControls = null;
    this.timer = new DropDownTimer();

    this.onProcessKey = this.processKey.bind(this);
    this.onProcessClick = this.processClick.bind(this);
    this.onCloseResults = this.closeResults.bind(this);
  }

  setController(ctrl: IGameController): void {
    this.ctrl = ctrl;
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createStartPageContent());
  }

  abstract getGameType(): GameType;

  startGame(data: GameCardData): void {
    this.root.innerHTML = '';
    this.root.append(this.createGameContent(data));
    this.addProcessGameListeners();
    if (this.getGameType() !== GameType.VoiceCall) {
      this.timer.startTimer(this.ctrl?.getGameLength() || 0);
    }
  }

  endGame(results: string[][]): void {
    this.removeProcessGameListeners();
    this.timer.stopTimer();
    this.root.innerHTML = '';
    const resultsOverlay = createResults(results);
    document.body.append(resultsOverlay);
    resultsOverlay.addEventListener('click', this.onCloseResults);
  }

  abstract showWord(data: GameCardData): void;

  updateScore(score: number): void {
    if (this.scoreBlock) {
      this.scoreBlock.innerHTML = score.toString();
    }
  }

  updatePoints(points: number): void {
    if (this.pointsBlock) {
      this.pointsBlock.innerHTML = points.toString();
    }
  }

  updateView(): void {
    if (!this.ctrl) {
      return;
    }
    this.startPage?.addControllsBlock(this.ctrl.canSelectUnit());
    this.addListeners();
  }

  protected addListeners(): void {
    const btn = this.startPage?.getButton();
    if (btn) {
      btn.addEventListener('click', () => {
        this.ctrl?.startGame(this.startPage?.getSelectedUnit());
      });
    }
  }

  protected addProcessGameListeners(): void {
    if (this.gameControls) {
      document.addEventListener('keydown', this.onProcessKey);
      this.gameControls.addEventListener('click', this.onProcessClick);
    }
  }

  removeProcessGameListeners(): void {
    if (this.gameControls) {
      document.removeEventListener('keydown', this.onProcessKey);
      this.gameControls.removeEventListener('click', this.onProcessClick);
    }
  }

  protected processClick(event: MouseEvent): void {
    const target = <HTMLElement>event.target;
    if (target.classList.contains('button')) {
      this.ctrl?.processAnswer(Number(target.id));
    }
  }

  protected abstract processKey(event: KeyboardEvent): void;

  protected abstract createWordCard(word?: IApiWords, data?: GameCardData): HTMLElement;

  private closeResults(event: MouseEvent): void {
    const target = event.target;
    if (!target || !(<HTMLElement>target).classList.contains('button')) {
      return;
    }

    const overlay = document.getElementById('results');
    if (!overlay) {
      return;
    }
    overlay.removeEventListener('click', this.onCloseResults);
    document.body.removeChild(overlay);
    this.render();
  }

  private createGameContent(data: GameCardData): HTMLElement {
    const parent = document.createElement('div');
    parent.className = 'game__container';
    if (GameType.VoiceCall !== this.getGameType()) {
      parent.append(this.timer.getTimerBlock());
    }
    parent.append(this.createScoreBlock());
    parent.append(this.createWordCard(data.word, data));
    return parent;
  }

  private createStartPageContent(): ReadonlyArray<HTMLElement> {
    const container: HTMLDivElement = document.createElement('div');
    container.className = 'game__container';
    if (this.startPage) {
      container.append(this.startPage.getContent());
    }
    return [container];
  }

  private createScoreBlock(): HTMLElement {
    const block: HTMLElement = document.createElement('div');
    const gameScore: HTMLElement = document.createElement('span');
    gameScore.className = 'game__score';
    gameScore.textContent = '0';
    block.className = 'game__counter';
    block.innerHTML = `Счёт`;
    block.append(gameScore);
    this.scoreBlock = gameScore;
    return block;
  }
}
