import { ChangePageFn } from '../controllers/types';
import { UnitLabels, PaginBtnType } from './constants';
import { IApiWords } from '../models/interfaces';
import { ITextBookController } from './../controllers/interfaces';

type MenuBtnType = HTMLAnchorElement;

type MenuBtn = MenuBtnType | undefined;

interface IView {
  render(): void;
  bindChangePage(handler: ChangePageFn): void;
}

interface ITextBookView extends IView {
  setController(ctrl: ITextBookController): void;
  renderWordList(wordsData: IApiWords[]): void;
  updateCards(unitName: string, cards: IApiWords[]): void;
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

interface IPagination {
  create(current?: number): HTMLDivElement;
  getCurrentPage(): number;
  update(btnType: PaginBtnType): void;
}

type UnitKeys = keyof typeof UnitLabels;

export {
  IView,
  IViewConstructor,
  ICard,
  MenuBtn,
  MenuBtnType,
  UnitKeys,
  ViewOrNotInit,
  IPagination,
  ITextBookView,
  TextBookViewOrNotInit,
};
