import { ViewPath } from '../../common/constants';
import { SprintStartPage } from './common/startPage';
import { BaseGameView } from './common/baseGame';
import { GameType } from '../../controllers/constants';
import { IApiWords } from '../../models/interfaces';
import CreateMarkup from './../common/createMarkup';

export class SprintView extends BaseGameView {
  private word: HTMLElement | undefined;

  private translation: HTMLElement | undefined;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.startPage = new SprintStartPage();
    this.word = undefined;
    this.translation = undefined;
  }

  static getPath(): string {
    return ViewPath.SPRINT;
  }

  getGameType(): GameType {
    return GameType.Sprint;
  }

  showWord(word: IApiWords): void {
    if (this.word && this.translation) {
      this.word.textContent = word.word;
      this.translation.textContent = word.wordTranslate;
    }
  }

  processKey(event: KeyboardEvent): void {
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
      this.ctrl?.processAnswer(event.key);
    }
  }

  createWordCard(word: IApiWords): HTMLElement {
    const card = document.createElement('div');
    card.className = 'game-card';
    const originWord = new CreateMarkup(card, 'div', 'game-card__word');
    originWord.node.textContent = word.word;
    const translation = new CreateMarkup(card, 'div', 'game-card__translate');
    translation.node.textContent = word.wordTranslate;

    this.word = originWord.node;
    this.translation = translation.node;

    const controls = new CreateMarkup(card, 'div', 'game-card__controls');
    const isFalseBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_false');
    isFalseBtn.node.id = 'incorrect';
    isFalseBtn.node.textContent = 'Неверно';
    const isTrueBtn = new CreateMarkup(controls.node, 'button', 'button game-card__btn game-card__btn_true');
    isTrueBtn.node.textContent = 'Верно';
    isTrueBtn.node.id = 'correct';
    this.gameControls = controls.node;

    return card;
  }
}
