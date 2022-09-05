import { IApiWords, IPaginatedResults } from '../models/interfaces';
import { GameType, UnitLevels } from './constants';

type TextBookState = {
  unit: UnitLevels;
  page: number;
};

type GameWordsData = {
  options: ReadonlyArray<string>;
  correctOption: number;
};

type GameCardData = {
  word: GameWord;
  options: ReadonlyArray<string>;
};

type StartGameOptions = {
  game: string;
  unit: number;
  page: number;
};

type GameWord = IApiWords | IPaginatedResults;

type GameFullResultsData = {
  game: GameType;
  words: GameWord[];
  answers: boolean[];
  score?: number;
};

type ProcessedWordsGroup = {
  correctOptions: number[];
  suggestedTranslations: string[][];
};

export {
  TextBookState,
  GameWordsData,
  GameCardData,
  StartGameOptions,
  GameWord,
  GameFullResultsData,
  ProcessedWordsGroup,
};
