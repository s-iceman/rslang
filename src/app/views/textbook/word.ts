import CreateMarkup from '../common/createMarkup';
import { IApiWords } from '../../models/interfaces';
import { ITextBookController } from '../../controllers/interfaces';

export default class Words extends CreateMarkup {
  private textBookCtrl: ITextBookController;

  constructor(private baseUrl: string, ctrl: ITextBookController, private parentNode = document.body) {
    super(parentNode, 'ul', 'words');
    this.baseUrl = baseUrl;
    this.textBookCtrl = ctrl;
    this.parentNode = parentNode;
  }

  addCardWord(wordsItem: IApiWords): HTMLElement {
    const { word, transcription, image, wordTranslate } = wordsItem;

    const wordCardTitle = `
      <div class="word__title">
          <h3>${word.slice(0, 1).toUpperCase()}${word.slice(1)} - <span>${transcription}</span></h3>
          <span class="word__subtitle">${wordTranslate}</span>
      </div>
    `;
    const wordCard = new CreateMarkup(this.parentNode, 'li', 'words__item word');
    const wordImg = new CreateMarkup(wordCard.node, 'div', 'word__img');
    wordImg.node.style.backgroundImage = `url(${this.baseUrl}/${image})`;

    const wordContent = new CreateMarkup(wordCard.node, 'div', 'word__content');
    const wordHeader = new CreateMarkup(wordContent.node, 'div', 'word__header', wordCardTitle);
    const wordPlay = new CreateMarkup(wordHeader.node, 'span', 'word__play');
    wordPlay.node.addEventListener('click', () => void this.textBookCtrl.playSound(wordsItem, wordPlay.node));
    this.addCardDescription(wordContent.node, wordsItem);
    return wordCard.node;
  }

  addCardDescription(node: HTMLElement, wordsItem: IApiWords) {
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
    new CreateMarkup(node, 'div', 'word__description', wordCardDesc);
    if (this.textBookCtrl.isAuth()) {
      this.addCardButton(node, id);
    }
  }

  addCardButton(parentNode: HTMLElement, id: string) {
    const wordButtons = new CreateMarkup(parentNode, 'div', 'word__buttons');
    const btnDiff = new CreateMarkup(wordButtons.node, 'button', 'button btn-diff', 'Сложное слово');
    const btnStudy = new CreateMarkup(wordButtons.node, 'button', 'button btn-study', 'Изученное слово');

    btnDiff.node.addEventListener('click', () => {
      (btnDiff.node as HTMLButtonElement).disabled = true;
      this.textBookCtrl.createUserWord(id, true, false).catch((err) => console.debug(err));
    });
    btnStudy.node.addEventListener('click', () => {
      (btnStudy.node as HTMLButtonElement).disabled = true;
      this.textBookCtrl.createUserWord(id, false, true).catch((err) => console.debug(err));
    });
  }
}
