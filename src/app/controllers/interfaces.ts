import { ViewOrNotInit } from '../views/interfaces';
import { UnitLevels } from './constants';
import { IApiWords, IStatistics } from './../models/interfaces';
import { GameCardData, GameWord, GameFullResultsData } from './types';

interface IAppController {
  start(): void;
}

interface IController {
  registerView(view: ViewOrNotInit, context?: string): void;
  updateView(): Promise<void>;
  isAuth(): boolean;
}

interface ITextBookController extends IController {
  checkLearnedWords(wordsData: IApiWords[]): boolean;
  checkLearnedPage(wordsData: IApiWords[]): boolean;
  getUnit(): UnitLevels;
  getPage(): number;
  playSound(wordsItem: IApiWords, node?: HTMLElement): Promise<void>;
  createUserWord(wordId: string, isDifficulty: boolean, isStudy?: boolean): Promise<void>;
  selectUnit(unitName: string): Promise<void>;
  changeUnitPage(page: number): Promise<void>;
  removeSound(): void;
}

interface IGameController extends IController {
  startGame(level?: UnitLevels): void;
  processAnswer(answerOption: number): void;
  canSelectUnit(): boolean;
}

interface IStatisticsController extends IController {
  getStatistics(): Promise<IStatistics>;
}

interface IGameEngine {
  preprocessWords(words: GameWord[]): void;
  checkAnswer(option: number): boolean;
  getNextWord(): GameCardData | undefined;
  getResults(): string[][];
  getFullResults(): GameFullResultsData;
  getScore(): number;
  getPoints(): number;
  clear(): void;
}

interface IModelHelper {
  getWords(level?: UnitLevels): Promise<GameWord[]>;
}

interface IRouter {
  process(newPath?: string): ViewOrNotInit;
  updateViewUrl(path: string): void;
}

export {
  IAppController,
  IRouter,
  ITextBookController,
  IGameController,
  IGameEngine,
  IModelHelper,
  IStatisticsController,
};
