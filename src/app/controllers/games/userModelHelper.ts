import { BaseModelHelper } from './modelHelper';
import AppModel from '../../models/AppModel';
import { longestStreak, createEmptyStatistics, dateToString } from './gameUtis';
import { StartGameOptions, GameWord, GameFullResultsData } from '../types';
import { IOptional, IPaginatedResults, IStatistics, IUserWord, IGameStatistics } from '../../models/interfaces';
import { UnitLevels, GameType } from '../constants';
import { MIN_GROUP_WORDS } from '../../models/constants';
import { DifficultyWord } from './../constants';

const LAST_N_CORRECT_TO_COMPLETE = 3;

const LAST_N_CORRECT_TO_COMPLETE_HARD = 5;

export class UserModelHelper extends BaseModelHelper {
  private statistics: IStatistics | null;

  constructor(model: AppModel, context?: StartGameOptions) {
    super(model, context);
    this.statistics = null;
  }

  async getWords(gameType: GameType, level?: UnitLevels): Promise<GameWord[][]> {
    await this.getSavedUserStatistics();

    const group = level !== undefined ? level : this.context?.unit || MIN_GROUP_WORDS;
    const wordsData = await this.model.getAllUserAggregatedWords(group);
    const words = wordsData.map((w) => w.paginatedResults).flat(1);
    if (gameType === GameType.VoiceCall) {
      return this.getVoiceCallWords(words);
    } else if (gameType === GameType.Sprint) {
      return this.getSprintWords(words);
    }
    throw new Error('Invalid game type');
  }

  private getSprintWords(words: IPaginatedResults[]): GameWord[][] {
    let other: IPaginatedResults[] = [];
    let targetWords: IPaginatedResults[] = [];

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
    return [targetWords, other];
  }

  private getVoiceCallWords(words: IPaginatedResults[]): GameWord[][] {
    let targetWords: IPaginatedResults[] = [];
    if (this.context) {
      targetWords = this.getUnstudiedWords(words, this.context.page);
    } else {
      const page = Math.round(this.getRandomPage());
      targetWords = words.filter((w) => w.page === page);
    }
    return [targetWords, []];
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
      if (i >= words.length) {
        console.debug('Invalid length of the word sequence');
        break;
      }
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

  private async getSavedUserStatistics(): Promise<void> {
    try {
      const statistics = await this.model.getUserStatistics();
      this.statistics = statistics;
    } catch (err) {
      this.statistics = createEmptyStatistics();
    }
  }
}
