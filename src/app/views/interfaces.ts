import { PaginBtnType } from './constants';
import { IApiWords } from '../models/interfaces';
import { IGameController, ITextBookController } from './../controllers/interfaces';
import { GameType } from '../controllers/constants';

type MenuBtnType = HTMLAnchorElement;

type MenuBtn = MenuBtnType | undefined;

interface IView {
  render(): void;
}

interface ITextBookView extends IView {
  setController(ctrl: ITextBookController): void;
  updateCards(unitName: string, cards: IApiWords[]): void;
  updateUnit(unitName: string, cards: IApiWords[]): void;
  updatePage(page: number): void;
}

interface IGameView extends IView {
  setController(ctrl: IGameController): void;
  updateView(): void;
  getGameType(): GameType;
  showWord(word?: IApiWords): void;
  startGame(word?: IApiWords): void;
  endGame(): void;
}

type ViewOrNotInit = IView | null;
type TextBookViewOrNotInit = ITextBookView | null;

interface IViewConstructor {
  new (baseUrl: string): IView;
  getPath(): string;
}

interface ICard {
  getContent(): string;
}

enum PaginType {
  TOP = 't',
  BOTTOM = 'b',
}

interface IPagination {
  create(activeBtnClass: string, btnIdPref?: PaginType): HTMLDivElement;
  getCurrentPage(): number;
  update(btnType: PaginBtnType, classNames?: Array<string>, current?: number): void;
  hideBlock(isHidden: boolean): void;
}

export {
  IView,
  IViewConstructor,
  ICard,
  MenuBtn,
  MenuBtnType,
  ViewOrNotInit,
  IPagination,
  ITextBookView,
  TextBookViewOrNotInit,
  IGameView,
  PaginType,
};
