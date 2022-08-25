import CreateMarkup from '../common/createMarkup';
import { IApiWords, IUserWord } from '../../models/interfaces';
import { ITextBookController } from '../../controllers/interfaces';

export default class Words extends CreateMarkup {
  private textBookCtrl: ITextBookController;

  constructor(private baseUrl: string, ctrl: ITextBookController, private parentNode: HTMLElement) {
    super(parentNode, 'ul', 'words');
    this.baseUrl = baseUrl;
    this.textBookCtrl = ctrl;
  }

  addCardWord(wordsItem: IApiWords, isHardUnit: boolean): HTMLElement {
    const { word, transcription, image, wordTranslate } = wordsItem;

    const wordCardTitle = `
      <div class="word__title">
          <h3>${word.slice(0, 1).toUpperCase()}${word.slice(1)} - <span>${transcription}</span></h3>
          <span class="word__subtitle">${wordTranslate}</span>
      </div>
    `;
    const wordCard = new CreateMarkup(this.node, 'li', 'words__item word');
    const wordImg = new CreateMarkup(wordCard.node, 'div', 'word__img');
    wordImg.node.style.backgroundImage = `url(${this.baseUrl}/${image})`;

    const wordContent = new CreateMarkup(wordCard.node, 'div', 'word__content');
    const wordHeader = new CreateMarkup(wordContent.node, 'div', 'word__header', wordCardTitle);
    const wordPlay = new CreateMarkup(wordHeader.node, 'span', 'word__play');
    wordPlay.node.addEventListener('click', () => void this.textBookCtrl.playSound(wordsItem, wordPlay.node));
    this.addCardDescription(wordCard.node, wordContent.node, wordsItem, isHardUnit);
    return wordCard.node;
  }

  addCardDescription(cardNode: HTMLElement, parentNode: HTMLElement, wordsItem: IApiWords, isHardUnit: boolean) {
    const { id, textMeaning, textMeaningTranslate, textExample, textExampleTranslate } = wordsItem;
    const wordCardDesc = `
      <div class="word__meaning">
          <p>${textMeaning}</p>
          <p>${textMeaningTranslate}</p>
      </div>
      <div class="word__example">
          <p>${textExample}</p>
          <p>${textExampleTranslate}</p>
      </div>
    `;
    new CreateMarkup(parentNode, 'div', 'word__description', wordCardDesc);
    const wordButtons = new CreateMarkup(parentNode, 'div', 'word__buttons');

    if (this.textBookCtrl.isAuth()) {
      if (wordsItem.userWord) {
        const { difficulty } = wordsItem.userWord;
        const { study } = wordsItem.userWord.optional;

        if (difficulty === 'hard' || study === true) {
          cardNode.style.backgroundImage = '-webkit-linear-gradient(bottom, rgba(0, 0, 0, 0), rgb(255 225 0 / 0.15)';
        }
        if (isHardUnit) {
          this.addCardButtonHard(cardNode, wordButtons.node, id);
        } else if (!isHardUnit) {
          this.addCardButton(cardNode, wordButtons.node, id, wordsItem.userWord);
        }
      } else {
        this.addCardButton(cardNode, wordButtons.node, id);
      }
    }
  }

  addCardButton(cardNode: HTMLElement, parentNode: HTMLElement, id: string, userWord?: IUserWord) {
    const wordButtons = new CreateMarkup(parentNode, 'div', 'word__buttons');
    const btnDiff = new CreateMarkup(wordButtons.node, 'button', 'button btn-diff', 'Сложное слово');
    const btnStudy = new CreateMarkup(wordButtons.node, 'button', 'button btn-study', 'Изученное слово');

    if (userWord) {
      const { difficulty, optional } = userWord;
      if (difficulty === 'hard') {
        (btnDiff.node as HTMLButtonElement).disabled = true;
      }
      if (optional.study === true) {
        (btnStudy.node as HTMLButtonElement).disabled = true;
      }
    }

    btnDiff.node.addEventListener('click', () => {
      (btnDiff.node as HTMLButtonElement).disabled = true;
      cardNode.style.backgroundImage = '-webkit-linear-gradient(bottom, rgba(0, 0, 0, 0), rgb(255 225 0 / 0.15))';
      this.textBookCtrl.createUserWord(id, true, false).catch((err) => console.debug(err));
    });
    btnStudy.node.addEventListener('click', () => {
      (btnStudy.node as HTMLButtonElement).disabled = true;
      cardNode.style.backgroundImage = '-webkit-linear-gradient(bottom, rgba(0, 0, 0, 0), rgb(255 225 0 / 0.15))';
      this.textBookCtrl.createUserWord(id, false, true).catch((err) => console.debug(err));
    });
  }

  addCardButtonHard(cardNode: HTMLElement, parentNode: HTMLElement, id: string) {
    const btnRemoveDiff = new CreateMarkup(parentNode, 'button', 'button btn-simple', 'Простое слово');

    btnRemoveDiff.node.addEventListener('click', () => {
      cardNode.remove();
      this.textBookCtrl.createUserWord(id, false).catch((err) => console.debug(err));
    });
  }
}
