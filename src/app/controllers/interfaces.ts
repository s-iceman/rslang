import { ViewOrNotInit } from '../views/interfaces';
import { UnitLevels } from './constants';
import { IApiWords } from './../models/interfaces';
import { GameCardData } from './types';

interface IAppController {
  start(): void;
}

interface IController {
  registerView(view: ViewOrNotInit, context?: string): void;
  updateView(): Promise<void>;
  isAuth(): boolean;
}

interface ITextBookController extends IController {
  isLearnedPage(wordsData: IApiWords[]): boolean;
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
  processAnswer(answerOption: number): void;
  getGameLength(): number;
  canSelectUnit(): boolean;
}

interface IGameEngine {
  preprocessWords(words: IApiWords[]): void;
  checkAnswer(option: number): boolean;
  getNextWord(): GameCardData | undefined;
  getResults(): string[][];
  getScore(): number;
  clear(): void;
}

interface IModelHelper {
  getWords(level?: UnitLevels): Promise<IApiWords[]>;
}

interface IRouter {
  process(newPath?: string): ViewOrNotInit;
}

export { IAppController, IRouter, ITextBookController, IGameController, IGameEngine, IModelHelper };
