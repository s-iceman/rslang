import { View } from '../../view';
import { IGameController } from '../../../controllers/interfaces';
import { IStartPage } from './../intefaces';
import { IGameView } from '../../interfaces';
import { GameType } from '../../../controllers/constants';
import { IApiWords } from '../../../models/interfaces';
import { DropDownTimer } from './timer';

export abstract class BaseGameView extends View implements IGameView {
  protected ctrl: IGameController | null;

  protected startPage: IStartPage | null;

  protected timerBlock: HTMLElement | null;

  protected scoreBlock: HTMLElement | null;

  protected gameControls: HTMLElement | null;

  protected timer: DropDownTimer;

  protected onProcessKey: (event: KeyboardEvent) => void;

  protected onProcessClick: (event: MouseEvent) => void;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.ctrl = null;
    this.startPage = null;
    this.scoreBlock = null;
    this.timerBlock = null;
    this.gameControls = null;
    this.timer = new DropDownTimer();
    this.onProcessKey = this.processKey.bind(this);
    this.onProcessClick = this.processClick.bind(this);
  }

  setController(ctrl: IGameController): void {
    this.ctrl = ctrl;
  }

  render(): void {
    this.root.innerHTML = '';
    this.root.append(...this.createStartPageContent());
  }

  abstract getGameType(): GameType;

  startGame(word?: IApiWords): void {
    this.root.innerHTML = '';
    this.root.append(this.createGameContent(word));
    this.addProcessGameListeners();
    this.timer.startTimer(this.ctrl?.getGameLength() || 0);
  }

  endGame(): void {
    this.removeProcessGameListeners();
    this.timer.stopTimer();
  }

  abstract showWord(word?: IApiWords): void;

  updateView(): void {
    this.startPage?.addControllsBlock(this.ctrl?.isAuth() || false);
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
      this.ctrl?.processAnswer(target.id);
    }
  }

  protected abstract processKey(event: KeyboardEvent): void;

  protected abstract createWordCard(word?: IApiWords): HTMLElement;

  private createGameContent(word?: IApiWords): HTMLElement {
    const parent = document.createElement('div');
    parent.className = 'game__container';
    parent.append(this.timer.getTimerBlock());
    parent.append(this.createScoreBlock());
    parent.append(this.createWordCard(word));
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
    block.className = 'game__score';
    block.textContent = '0';
    this.scoreBlock = block;
    return block;
  }
}
