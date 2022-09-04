import { IModelHelper } from '../interfaces';
import AppModel from '../../models/AppModel';
import { longestStreak, createEmptyStatistics, dateToString } from './gameUtis';
import { StartGameOptions, GameWord, GameFullResultsData } from '../types';
import {
  IApiWords,
  IOptional,
  IPaginatedResults,
  IStatistics,
  IUserWord,
  IGameStatistics,
} from '../../models/interfaces';
import { UnitLevels, GameType } from '../constants';
import { MAX_PAGE_WORDS } from '../../common/constants';
import { MIN_GROUP_WORDS } from '../../models/constants';
import { DifficultyWord } from './../constants';

const LAST_N_CORRECT_TO_COMPLETE = 5;

const LAST_N_CORRECT_TO_COMPLETE_HARD = 7;

abstract class BaseModelHelper implements IModelHelper {
  protected model: AppModel;

  protected context: StartGameOptions | undefined;

  constructor(model: AppModel, context?: StartGameOptions) {
    this.model = model;
    this.context = context;
  }

  abstract getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]>;

  protected getRandomPage(): number {
    return Math.round(Math.random() * MAX_PAGE_WORDS);
  }
}

class ModelHelper extends BaseModelHelper {
  async getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]> {
    let other: IApiWords[] = [];
    let targetWords: IApiWords[] = [];
    const page = (level !== undefined ? this.getRandomPage() : this.context?.page) || 0;
    const unit = level !== undefined ? level : this.context?.unit;

    if (gameType === GameType.Sprint) {
      const availablePages = [...Array(page).keys()];
      targetWords = await this.model.getWords(unit, page);
      const rawOther = await Promise.all(availablePages.map(async (p) => this.model.getWords(unit, p)));
      other = rawOther.flat(1);
    } else if (gameType === GameType.VoiceCall) {
      targetWords = await this.model.getWords(unit, page);
    } else {
      throw new Error('Invalid game type');
    }
    console.log('!!!!', targetWords.length, other.length);
    return [targetWords, other];
  }
}

class UserModelHelper extends BaseModelHelper {
  private statistics: IStatistics | null;

  constructor(model: AppModel, context?: StartGameOptions) {
    super(model, context);
    this.statistics = null;
  }

  async getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]> {
    try {
      const statistics = await this.model.getUserStatistics();
      this.statistics = statistics;
    } catch (err) {
      this.statistics = createEmptyStatistics();
    }
    const group = level !== undefined ? level : this.context?.unit || MIN_GROUP_WORDS;
    const wordsData = await this.model.getAllUserAggregatedWords(group);
    const words = wordsData.map((w) => w.paginatedResults).flat(1);
    let other: IPaginatedResults[] = [];
    let targetWords: IPaginatedResults[] = [];
    if (gameType === GameType.VoiceCall) {
      if (this.context) {
        targetWords = this.getUnstudiedWords(words, this.context.page);
      } else {
        targetWords = words.filter((w) => w.page === Math.round(this.getRandomPage()));
        console.log(targetWords.length);
      }
    } else if (gameType === GameType.Sprint) {
      if (this.context) {
        // go from the Textbook, use only subset of pages and don't use learned words
        const page = this.context.page;
        targetWords = this.getUnstudiedWords(words, page);
        other = words.filter((w) => w.page < page && (w.userWord === undefined || !w.userWord.optional.study));
      } else {
        const page = Math.round(this.getRandomPage());
        targetWords = words.filter((w) => w.page === page);
        other = words.filter((w) => w.page < page);
      }
    } else {
      throw new Error('Invalid game type');
    }
    console.log('!!!!', targetWords.length, other.length);

    return [targetWords, other];
  }

  private getUnstudiedWords(words: IPaginatedResults[], page: number): IPaginatedResults[] {
    return words.filter((w) => w.page === page && (w.userWord === undefined || !w.userWord.optional.study));
  }

  async processGameResults(data: GameFullResultsData): Promise<boolean> {
    const dateString = dateToString(new Date());
    const { game, answers } = data;
    const words = data.words as IPaginatedResults[];
    const updatedWords: IUserWord[] = [];
    const newWords: IUserWord[] = [];
    this.updateEmptyStatistics(data, dateString);

    for (let i = 0; i < data.answers.length; i += 1) {
      const word: IPaginatedResults = words[i];
      if (words[i].userWord === undefined) {
        const optional = this.createNewWordOptional(word, answers[i], game, dateString);
        newWords.push({
          wordId: word._id,
          difficulty: DifficultyWord.Simple,
          optional: optional,
        });
      } else {
        const optional = this.updateUserWordOptional(word, answers[i], game, dateString);
        updatedWords.push({
          wordId: word._id,
          difficulty: optional.study ? DifficultyWord.Simple : word.userWord.difficulty,
          optional: optional,
        });
      }
    }

    const gameStatistics = this.getTmpGameStatistics(game, dateString);
    if (gameStatistics) {
      gameStatistics.nCorrect += answers.filter((x) => x === true).length;
      gameStatistics.nTotal += answers.length;
      const streak = longestStreak(answers);
      if (streak > gameStatistics.streak) {
        gameStatistics.streak = streak;
      }
    }

    await Promise.all(newWords.map(async (w) => this.model.postUserWord(w.wordId, w.difficulty, w.optional)));
    await Promise.all(updatedWords.map(async (w) => this.model.updateUserWord(w.wordId, w.difficulty, w.optional)));
    if (this.statistics) {
      await this.model.setUserStatistics(this.statistics);
    }

    return true;
  }

  private createNewWordOptional(word: GameWord, answer: boolean, game: string, date: string): IOptional {
    const correctAnswers = +answer;
    const lastNCorrect = correctAnswers;
    const study = lastNCorrect >= LAST_N_CORRECT_TO_COMPLETE;
    const optional: IOptional = {
      study,
      firstIntroducedGame: game,
      firstIntroducedDate: date,
      correctAnswers,
      incorrectAnswers: answer ? 0 : 1,
      lastNCorrect,
    };

    const gameStatistics: IGameStatistics | undefined = this.getTmpGameStatistics(game, date);
    if (this.statistics && gameStatistics) {
      gameStatistics.nNew += 1;
      this.updateDeltaComplete(date, 1);
    }

    return optional;
  }

  private updateUserWordOptional(word: GameWord, answer: boolean, game: string, date: string): IOptional {
    const wordOptional = word.userWord.optional;
    let correctAnswers = wordOptional.correctAnswers || 0;
    let incorrectAnswers = wordOptional.incorrectAnswers || 0;
    let lastNCorrect = wordOptional.lastNCorrect || 0;
    let { study, firstIntroducedDate, firstIntroducedGame } = wordOptional;

    if (answer) {
      lastNCorrect += 1;
      correctAnswers += 1;
      if (!study) {
        if (
          (word.userWord.difficulty == DifficultyWord.Simple && lastNCorrect >= LAST_N_CORRECT_TO_COMPLETE) ||
          (word.userWord.difficulty == DifficultyWord.Hard && lastNCorrect >= LAST_N_CORRECT_TO_COMPLETE_HARD)
        ) {
          study = true;
          this.updateDeltaComplete(date, 1);
        }
      }
    } else {
      lastNCorrect = 0;
      incorrectAnswers += 1;
      if (study) {
        this.updateDeltaComplete(date, -1);
        study = false;
      }
    }

    const gameStatistics: IGameStatistics | undefined = this.getTmpGameStatistics(game, date);
    if (!firstIntroducedDate || firstIntroducedDate == '-') {
      firstIntroducedDate = date;
      firstIntroducedGame = game;
      if (gameStatistics) {
        gameStatistics.nNew += 1;
      }
    }

    const optional: IOptional = {
      study,
      firstIntroducedDate,
      firstIntroducedGame,
      correctAnswers,
      incorrectAnswers,
      lastNCorrect,
    };
    return optional;
  }

  private updateEmptyStatistics(data: GameFullResultsData, dateString: string): void {
    if (!this.statistics) {
      return;
    }
    const { game } = data;
    const games = this.statistics.optional.games;
    if (!(game in games)) {
      games[game] = {};
    }
    const gameData = games[game];
    if (gameData && !(dateString in gameData)) {
      gameData[dateString] = {
        nNew: 0,
        nCorrect: 0,
        nTotal: 0,
        streak: 0,
      };
    }
    if (!(dateString in this.statistics.optional.deltaComplete)) {
      this.statistics.optional.deltaComplete[dateString] = 0;
    }
  }

  private updateDeltaComplete(date: string, diff: number): void {
    const deltaComplete = this.getDeltaComplete();
    if (!deltaComplete) {
      return;
    }
    const value = deltaComplete[date];
    if (value !== undefined) {
      deltaComplete[date] = value + diff;
    }
  }

  private getTmpGameStatistics(game: string, date: string): IGameStatistics | undefined {
    return this.statistics?.optional.games[game][date];
  }

  private getDeltaComplete(): Record<string, number> | undefined {
    return this.statistics?.optional.deltaComplete;
  }
}

export { ModelHelper, UserModelHelper };
