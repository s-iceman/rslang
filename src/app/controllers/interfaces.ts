import { ViewOrNotInit } from '../views/interfaces';
import { UnitLevels } from './constants';
import { IApiWords } from './../models/interfaces';

interface IAppController {
  start(): void;
}

interface IController {
  registerView(view: ViewOrNotInit): void;
  updateView(): Promise<void>;
  isAuth(): boolean;
}

interface ITextBookController extends IController {
  getUnit(): UnitLevels;
  getPage(): number;
  playSound(wordsItem: IApiWords, node: HTMLElement): Promise<void>;
  createUserWord(wordId: string, isDifficulty: boolean, isStudy?: boolean): Promise<void>;
  selectUnit(unitName: string): Promise<void>;
  changeUnitPage(page: number): Promise<void>;
  removeSound(): void;
}

interface IGameController extends IController {
  startGame(level?: UnitLevels): void;
  processAnswer(answerOption: string): void;
}

interface IRouter {
  process(newPath?: string): ViewOrNotInit;
}

export { IAppController, IRouter, ITextBookController, IGameController };
