import { GameType } from '../constants';
import { IGameEngine } from './../interfaces';
import { GameCardData, GameWord, GameFullResultsData } from './../types';
import { shuffle } from './gameUtis';

const COEF = 10;

abstract class GameEngine implements IGameEngine {
  protected words: GameWord[];

  protected userAnswers: boolean[];

  protected suggestedTranslations: string[][];

  protected correctOptions: number[];

  protected idx: number;

  constructor() {
    this.words = [];
    this.userAnswers = [];
    this.suggestedTranslations = [];
    this.correctOptions = [];
    this.idx = -1;
  }

  abstract getScore(): number;

  abstract getPoints(): number;

  abstract preprocessWords(words: GameWord[][]): void;

  abstract checkAnswer(option: number): boolean;

  abstract getNextWord(): GameCardData | undefined;

  getResults(): string[][] {
    const correct: string[] = [];
    const incorrect: string[] = [];
    this.words.slice(0, this.idx).forEach((w, idx) => {
      if (this.userAnswers[idx]) {
        correct.push(w.word || '');
      } else {
        incorrect.push(w.word || '');
      }
    });
    return [correct, incorrect];
  }

  getFullResults(): GameFullResultsData {
    return {
      game: this.getGameType(),
      words: this.words,
      answers: this.userAnswers,
    };
  }

  clear(): void {
    this.words = [];
    this.userAnswers = [];
    this.suggestedTranslations = [];
    this.correctOptions = [];
    this.idx = -1;
  }

  protected abstract getGameType(): GameType;
}

class AudioCallEngine extends GameEngine {
  private streakLength: number;

  private total: number;

  private totalPoints: number;

  private singleAnswerScore: number;

  constructor() {
    super();
    this.streakLength = 0;
    this.total = 0;
    this.totalPoints = COEF;
    this.singleAnswerScore = 1;
  }

  preprocessWords(words: GameWord[][]): void {
    this.words = words[0];
    const correctWord = new Array<string>();
    const optionsBtnTranslation = words[0].map((w) => [w.wordTranslate]);
    optionsBtnTranslation.forEach((element) => {
      correctWord.push(element[0]);
      const allWordsExcludetCurrent = words[0].filter((w) => w.wordTranslate !== element[0]);
      const wordsForOptions = shuffle(allWordsExcludetCurrent).slice(0, 4);
      wordsForOptions.forEach((el) => {
        element.push(el.wordTranslate);
      });
    });
    optionsBtnTranslation.forEach((element) => {
      this.suggestedTranslations.push(shuffle(element));
    });
    this.suggestedTranslations.forEach((element, index) => {
      this.correctOptions.push(element.indexOf(correctWord[index]));
    });
    this.idx = -1;
  }

  checkAnswer(option: number): boolean {
    const isCorrect = option === this.correctOptions[this.idx];

    this.userAnswers.push(isCorrect);
    if (isCorrect) {
      this.streakLength += 1;
      this.total += this.singleAnswerScore * COEF;
      if (this.streakLength % 3 === 0) {
        this.streakLength = 0;
        this.singleAnswerScore *= 2;
      }
    } else {
      this.streakLength = 0;
      this.singleAnswerScore = 1;
    }
    this.totalPoints = this.singleAnswerScore * COEF;
    return isCorrect;
  }

  getNextWord(): GameCardData | undefined {
    this.idx += 1;
    if (this.idx < this.words.length) {
      return {
        word: this.words[this.idx],
        options: this.suggestedTranslations[this.idx],
      };
    }
  }

  getScore(): number {
    return this.total;
  }

  getPoints(): number {
    return this.totalPoints;
  }

  clear(): void {
    super.clear();
    this.streakLength = 0;
    this.total = 0;
    this.singleAnswerScore = 1;
  }

  protected getGameType(): GameType {
    return GameType.VoiceCall;
  }
}

export { GameEngine, AudioCallEngine, COEF };
