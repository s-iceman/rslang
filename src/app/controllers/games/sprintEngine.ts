import { GameType } from '../constants';
import { GameCardData, GameWord, GameFullResultsData, ProcessedWordsGroup } from './../types';
import { GameEngine, COEF } from './gameEngines';
import { shuffle, takeFirstNWithCondition } from './gameUtis';

const MAX_POINTS = 80;

export class SprintEngine extends GameEngine {
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
    this.words = [...words[0], ...words[1]];
    const targetRes = this.preprocessWordGroup(words[0]);
    const otherRes = this.preprocessWordGroup(words[1]);
    this.suggestedTranslations = [...targetRes.suggestedTranslations, ...otherRes.suggestedTranslations];
    this.correctOptions = [...targetRes.correctOptions, ...otherRes.correctOptions];
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
        if (this.singleAnswerScore * COEF <= MAX_POINTS / 2) {
          this.singleAnswerScore *= 2;
        }
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

  getFullResults(): GameFullResultsData {
    const result = super.getFullResults();
    result.score = this.total;
    return result;
  }

  protected getGameType(): GameType {
    return GameType.Sprint;
  }

  private preprocessWordGroup(wordsGroup: GameWord[]): ProcessedWordsGroup {
    const suggestedTranslations = wordsGroup.map((w) => [w.wordTranslate]);
    const correctOptions = wordsGroup.map(() => (Math.random() >= 0.5 ? 0 : 1));
    const randomIndices: number[] = shuffle<number>([...Array(wordsGroup.length).keys()]);
    correctOptions.forEach((option, i) => {
      let distractorIdx = takeFirstNWithCondition<number>(randomIndices, i, 1, (j) => j != i).pop();
      if (distractorIdx === undefined) {
        distractorIdx = randomIndices[i];
      }
      const distractor = suggestedTranslations[distractorIdx][0];
      if (option == 0) {
        suggestedTranslations[i].push(distractor);
      } else {
        suggestedTranslations[i].unshift(distractor);
      }
    });
    return {
      suggestedTranslations,
      correctOptions,
    };
  }
}
