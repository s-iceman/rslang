import { ChangePageFn, SelectUnitFn } from '../controllers/types';
import { UnitLabels, PaginBtnType } from './constants';

type MenuBtnType = HTMLAnchorElement;

type MenuBtn = MenuBtnType | undefined;

interface IView {
  render(): void;
  bindChangePage(handler: ChangePageFn): void;
  bindUnitListeners?(handler: SelectUnitFn): void;
  updateCards?(unitName: string): void;
  bindChangePageListeners?(): void;
}

type ViewOrNotInit = IView | null;

interface IViewConstructor {
  new (): IView;
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

export { IView, IViewConstructor, ICard, MenuBtn, MenuBtnType, UnitKeys, ViewOrNotInit, IPagination };
