import { ViewPath } from '../../common/constants';
import { SprintStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import CreateMarkup from './../common/createMarkup';
import { GameCardData } from '../../controllers/types';
import { AnswerBtnType } from '../constants';

export class SprintView extends BaseGameView {
  private word: HTMLElement | undefined;

  private translation: HTMLElement | undefined;

  private guessedWords: HTMLElement | null;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new SprintStartPage();
    this.word = undefined;
    this.translation = undefined;
    this.pointsBlock = null;
    this.guessedWords = null;
  }

  static getPath(): string {
    return ViewPath.SPRINT;
  }

  getGameType(): GameType {
    return GameType.Sprint;
  }

  showWord(data: GameCardData): void {
    if (this.word && this.translation && data.word) {
      this.word.textContent = data.word.word.toString();
      this.translation.textContent = data.options[0];
    } else {
      console.debug('Incorrect input data for a card');
    }
  }

  processKey(event: KeyboardEvent): void {
    const key = event.key;
    if (key == 'ArrowLeft' || key == 'ArrowRight') {
      const selectedOption = key === 'ArrowLeft' ? AnswerBtnType.Correct : AnswerBtnType.Incorrect;
      this.ctrl?.processAnswer(selectedOption);
    }
  }

  createWordCard(data: GameCardData): HTMLElement {
    const card = document.createElement('div');
    card.className = 'game-card wrapper';
    this.gameCard = card;
    const points = new CreateMarkup(card, 'div', 'points');
    const guessedWords = new CreateMarkup(points.node, 'div', 'guessed-words');
    new CreateMarkup(guessedWords.node, 'div', 'guessed-words__item');
    new CreateMarkup(guessedWords.node, 'div', 'guessed-words__item');
    new CreateMarkup(guessedWords.node, 'div', 'guessed-words__item');
    this.guessedWords = guessedWords.node;

    const pointsСounter = new CreateMarkup(points.node, 'div', 'points-counter');
    const score = new CreateMarkup(pointsСounter.node, 'span', 'points__score', '10');
    pointsСounter.node.innerHTML = `+${pointsСounter.node.innerHTML} очков`;

    const cardWord = new CreateMarkup(card, 'div', 'game-card__word game-word');
    const originWord = new CreateMarkup(cardWord.node, 'h3', 'game-word__origin');
    originWord.node.textContent = data.word.word.toString();
    const translation = new CreateMarkup(cardWord.node, 'span', 'game-word__translate');
    translation.node.textContent = data.options[0];

    this.word = originWord.node;
    this.translation = translation.node;
    this.pointsBlock = score.node;

    const controls = new CreateMarkup(card, 'div', 'game-card__controls');
    const isTrueBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_true');
    isTrueBtn.node.textContent = 'Верно';
    isTrueBtn.node.id = String(AnswerBtnType.Correct);

    const isFalseBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_false');
    isFalseBtn.node.id = String(AnswerBtnType.Incorrect);
    isFalseBtn.node.textContent = 'Неверно';

    this.gameControls = controls.node;

    return card;
  }

  updatePoints(points: number, isCorrect?: boolean): void {
    super.updatePoints(points);
    const guessed = this.guessedWords?.childNodes;
    if (!guessed) {
      return;
    }
    const htmlGuessed = Array.from(guessed);
    if (!isCorrect) {
      htmlGuessed.forEach((e) => (<HTMLElement>e).classList.remove('item--active'));
    } else {
      const availableItems = htmlGuessed.filter((elem) => !(<HTMLElement>elem).classList.contains('item--active'));
      if (availableItems.length > 0 && availableItems.length < guessed.length) {
        (<HTMLElement>availableItems[0]).classList.add('item--active');
      } else {
        htmlGuessed.forEach((e) => (<HTMLElement>e).classList.remove('item--active'));
        (<HTMLElement>htmlGuessed[0]).classList.add('item--active');
      }
    }
  }
}
