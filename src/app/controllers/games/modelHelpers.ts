import { IModelHelper } from '../interfaces';
import AppModel from '../../models/AppModel';
import { StartGameOptions, GameWord, GameFullResultsData } from '../types';
import { IApiWords, IOptional, IPaginatedResults, IUserWord } from '../../models/interfaces';
import { UnitLevels } from '../constants';
import { MAX_PAGE_WORDS } from '../../common/constants';
import { MIN_GROUP_WORDS } from '../../models/constants';
import { DifficultyWord } from './../constants';

const LAST_N_CORRECT_TO_COMPLETE = 3;

const LAST_N_CORRECT_TO_COMPLETE_HARD = 5;

abstract class BaseModelHelper implements IModelHelper {
  protected model: AppModel;

  protected context: StartGameOptions | undefined;

  constructor(model: AppModel, context?: StartGameOptions) {
    this.model = model;
    this.context = context;
  }

  abstract getWords(level?: UnitLevels): Promise<GameWord[]>;

  protected getRandomPage(): number {
    return Math.random() * MAX_PAGE_WORDS;
  }
}

class ModelHelper extends BaseModelHelper {
  async getWords(level?: UnitLevels): Promise<GameWord[]> {
    let words: IApiWords[];
    if (level !== undefined) {
      const page = this.getRandomPage();
      words = await this.model.getWords(level, page);
    } else {
      words = await this.model.getWords(this.context?.unit, this.context?.page);
    }
    return words;
  }
}

class UserModelHelper extends BaseModelHelper {
  async getWords(level?: UnitLevels): Promise<GameWord[]> {
    const group = level !== undefined ? level : this.context?.unit || MIN_GROUP_WORDS;
    const wordsData = await this.model.getAllUserAggregatedWords(group);
    let words = wordsData.map((w) => w.paginatedResults).flat(1);
    if (this.context) {
      // go from the Textbook, use only subset of pages and don't use learned words
      const page = this.context.page;
      words = words.filter((w) => w.page === page && (w.userWord === undefined || !w.userWord.optional.study));
    }
    return words;
  }

  async processGameResults(data: GameFullResultsData): Promise<boolean> {
    const dateString = this.dateToString(new Date());
    const { game, answers } = data;
    const words = data.words as IPaginatedResults[];
    const updatedWords: IUserWord[] = [];
    const newWords: IUserWord[] = [];

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
          difficulty: word.userWord.difficulty,
          optional: optional,
        });
      }
    }
    await Promise.all(newWords.map(async (w) => this.model.postUserWord(w.wordId, w.difficulty, w.optional)));
    await Promise.all(updatedWords.map(async (w) => this.model.updateUserWord(w.wordId, w.difficulty, w.optional)));

    return true;
  }

  private createNewWordOptional(word: GameWord, answer: boolean, game: string, date: string): IOptional {
    const optional: IOptional = {
      study: false,
      firstIntroducedGame: game,
      firstIntroducedDate: date,
      correctAnswers: +answer,
      incorrectAnswers: answer ? 0 : 1,
      lastNCorrect: +answer,
    };
    return optional;
  }

  private updateUserWordOptional(word: GameWord, answer: boolean, game: string, date: string): IOptional {
    let lastNCorrect = word.userWord.optional.lastNCorrect || 0;
    let study = word.userWord.optional.study;
    let correctAnswers = word.userWord.optional.correctAnswers || 0;
    let incorrectAnswers = word.userWord.optional.incorrectAnswers || 0;
    if (answer) {
      lastNCorrect += 1;
      correctAnswers += 1;
      if (!study) {
        if (
          (word.userWord.difficulty === DifficultyWord.Hard && lastNCorrect >= LAST_N_CORRECT_TO_COMPLETE_HARD) ||
          lastNCorrect >= LAST_N_CORRECT_TO_COMPLETE
        ) {
          study = true;
        }
      }
    } else {
      lastNCorrect = 0;
      incorrectAnswers += 1;
      study = false;
    }
    const optional: IOptional = {
      study: study,
      firstIntroducedDate: date,
      firstIntroducedGame: game,
      correctAnswers,
      incorrectAnswers,
      lastNCorrect,
    };
    return optional;
  }

  private dateToString(date: Date): string {
    return date.toJSON().slice(0, 10);
  }
}

export { ModelHelper, UserModelHelper };
