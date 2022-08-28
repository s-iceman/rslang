import { View } from '../../view';
import { IGameController } from '../../../controllers/interfaces';
import { IStartPage } from './../intefaces';
import { IGameView } from '../../interfaces';
import { GameType } from '../../../controllers/constants';
import { IApiWords } from '../../../models/interfaces';

export abstract class BaseGameView extends View implements IGameView {
  protected ctrl: IGameController | null;

  protected startPage: IStartPage | null;

  protected timerBlock: HTMLElement | null;

  protected scoreBlock: HTMLElement | null;

  protected gameControls: HTMLElement | null;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.ctrl = null;
    this.startPage = null;
    this.scoreBlock = null;
    this.timerBlock = null;
    this.gameControls = null;
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
      document.addEventListener('keydown', (event) => {
        this.processKey(event);
      });
      this.gameControls.addEventListener('click', (event) => {
        const target = <HTMLElement>event.target;
        if (target.classList.contains('button')) {
          this.ctrl?.processAnswer(target.id);
        }
      });
    }
  }

  protected abstract processKey(event: KeyboardEvent): void;

  protected abstract createWordCard(word?: IApiWords): HTMLElement;

  private createGameContent(word?: IApiWords): HTMLElement {
    const parent = document.createElement('div');
    parent.className = 'game__container';
    parent.append(this.createTimerBlock());
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

  private createTimerBlock(): HTMLElement {
    const block: HTMLElement = document.createElement('div');
    block.className = 'game__timer';
    block.textContent = '60';
    this.timerBlock = block;
    return block;
  }
}
