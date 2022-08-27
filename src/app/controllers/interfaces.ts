import { ViewOrNotInit } from '../views/interfaces';
import { UnitLevels } from './constants';
import { IApiWords } from './../models/interfaces';

interface IAppController {
  start(): void;
}

interface ITextBookController {
  getUnit(): UnitLevels;
  registerView(view: ViewOrNotInit): void;
  updateView(): Promise<void>;
  playSound(wordsItem: IApiWords, node: HTMLElement): Promise<void>;
  createUserWord(wordId: string, isDifficulty: boolean, isStudy?: boolean): Promise<void>;
  isAuth(): boolean;
  selectUnit(unitName: string): Promise<void>;
  changeUnitPage(page: number): Promise<void>;
  removeSound(): void;
}

interface IRouter {
  process(newPath?: string): ViewOrNotInit;
}

export { IAppController, IRouter, ITextBookController };
