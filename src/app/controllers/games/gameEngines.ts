import { IApiWords } from '../../models/interfaces';
import { IGameEngine } from './../interfaces';
import { GameCardData } from './../types';

const COEF = 10;

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function takeFirstNWithCondition<T>(arr: T[], startIdx: number, n: number, condition: (T) => boolean) {
  const output: T[] = [];
  let idx = startIdx;
  while (output.length < n && idx < arr.length) {
    if (condition(arr[idx])) {
      output.push(arr[idx]);
    }
    idx += 1;
  }
  return output;
}

abstract class GameEngine implements IGameEngine {
  protected words: IApiWords[];

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

  abstract preprocessWords(words: IApiWords[]): void;

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

  clear(): void {
    this.words = [];
    this.userAnswers = [];
    this.suggestedTranslations = [];
    this.correctOptions = [];
    this.idx = -1;
  }
}

class SprintEngine extends GameEngine {
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

  preprocessWords(words: IApiWords[]): void {
    this.words = words;
    this.suggestedTranslations = words.map((w) => [w.wordTranslate]);
    this.correctOptions = words.map(() => (Math.random() >= 0.5 ? 0 : 1));
    const randomIndices: number[] = shuffle<number>([...Array(words.length).keys()]);
    this.correctOptions.forEach((option, i) => {
      let distractorIdx = takeFirstNWithCondition<number>(randomIndices, i, 1, (j) => j != i).pop();
      if (distractorIdx === undefined) {
        distractorIdx = randomIndices[i];
      }
      const distractor = this.suggestedTranslations[distractorIdx][0];
      if (option == 0) {
        this.suggestedTranslations[i].push(distractor);
      } else {
        this.suggestedTranslations[i].unshift(distractor);
      }
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
    if (this.idx === this.words.length - 1) {
      return;
    }
    return {
      word: this.words[this.idx],
      options: this.suggestedTranslations[this.idx],
    };
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

  preprocessWords(words: IApiWords[]): void {
    this.words = words;
    const correctWord = new Array<string>();
    const suggestedTranslations2 = words.map((w) => [w.wordTranslate]);
    suggestedTranslations2.forEach((element) => {
      correctWord.push(element[0]);
      const allWordsExcludetCurrent = words.filter((w) => w.wordTranslate !== element[0]);
      const wordsForOptions = shuffle(allWordsExcludetCurrent).slice(0, 4);
      wordsForOptions.forEach((el) => {
        element.push(el.wordTranslate);
      });
    });
    suggestedTranslations2.forEach((element) => {
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
    if (this.idx === this.words.length - 1) {
      return;
    }
    return {
      word: this.words[this.idx],
      options: this.suggestedTranslations[this.idx],
    };
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
}

export { SprintEngine, AudioCallEngine };
