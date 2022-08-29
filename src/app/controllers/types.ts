import { IApiWords } from '../models/interfaces';
import { UnitLevels } from './constants';

type TextBookState = {
  unit: UnitLevels;
  page: number;
};

type GameWordsData = {
  options: ReadonlyArray<string>;
  correctOption: number;
};

type GameCardData = {
  word: IApiWords;
  options: ReadonlyArray<string>;
};

type StartGameOptions = {
  game: string;
  unit: number;
  page: number;
};

export { TextBookState, GameWordsData, GameCardData, StartGameOptions };
